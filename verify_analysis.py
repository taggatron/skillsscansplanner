import zipfile
import xml.etree.ElementTree as ET
import os
import re
import math
import random

def parse_xlsx(file_path):
    # Standard parser using built-in libraries
    with zipfile.ZipFile(file_path, 'r') as zip_ref:
        namelist = zip_ref.namelist()
        
        # Read shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in namelist:
            with zip_ref.open('xl/sharedStrings.xml') as f:
                tree = ET.parse(f)
                root = tree.getroot()
                ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
                for si in root.findall('ns:si', ns):
                    t_elems = si.findall('.//ns:t', ns)
                    text = "".join([t.text for t in t_elems if t.text])
                    shared_strings.append(text)

        # Read worksheet
        with zip_ref.open('xl/worksheets/sheet1.xml') as f:
            tree = ET.parse(f)
            root = tree.getroot()
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            rows = root.findall('.//ns:row', ns)
            
            items = []
            current_theme = "General Theme"
            for r in rows:
                row_idx = r.attrib.get('r')
                cells = r.findall('ns:c', ns)
                
                col_b = ""
                col_c = ""
                for c in cells:
                    ref = c.attrib.get('r')
                    t = c.attrib.get('t')
                    v_el = c.find('ns:v', ns)
                    v = v_el.text if v_el is not None else ""
                    if t == 's' and v:
                        v = shared_strings[int(v)]
                    
                    if ref.startswith('B' + str(row_idx)):
                        col_b = v.strip()
                    elif ref.startswith('C' + str(row_idx)):
                        col_c = v.strip()
                
                # Check for KSB codes in Column B
                ksb_codes = re.findall(r'[KSBksb]\d+', col_b)
                if ksb_codes:
                    items.append({
                        'row_idx': int(row_idx),
                        'ksb_codes': [code.upper() for code in ksb_codes],
                        'desc': col_c,
                        'theme': current_theme
                    })
                elif col_b and not col_c and len(col_b) > 2:
                    current_theme = col_b
            return items

def run_verification():
    print("=== Verification of Skills Scan Analytics Math ===")
    
    files = {
        'L3 Outdoor Instructor': 'Skills Scan - L3 Outdoor Instructor.xlsx',
        'L2 Leisure Team Member': 'Skills Scan - L2 Leisure Team Member.xlsx'
    }
    
    for label, filename in files.items():
        print(f"\nStandard: {label}")
        if not os.path.exists(filename):
            print(f"File not found: {filename}")
            continue
            
        rows = parse_xlsx(filename)
        print(f"  Parsed KSB rows count: {len(rows)}")
        
        # Build unique KSB codes list
        ksb_to_rows = {}
        for row_idx, r in enumerate(rows):
            for code in r['ksb_codes']:
                if code not in ksb_to_rows:
                    ksb_to_rows[code] = []
                ksb_to_rows[code].append(row_idx)
                
        print(f"  Unique KSB count: {len(ksb_to_rows)}")
        
        # Simulate cohort scores: 15 learners, rows rows
        cohort_size = 15
        total_glh = 1000
        
        # Generate random scores for each learner for each row
        random.seed(42) # for deterministic outputs
        cohort_row_scores = []
        for l in range(cohort_size):
            learner_scores = [random.randint(0, 10) for _ in range(len(rows))]
            cohort_row_scores.append(learner_scores)
            
        # Calculate cohort score aggregations per KSB item
        ksb_aggregations = []
        for code, row_refs in ksb_to_rows.items():
            # For each learner, calculate KSB score as average of referenced rows
            learner_scores_for_ksb = []
            for l in range(cohort_size):
                sum_scores = sum(cohort_row_scores[l][r_idx] for r_idx in row_refs)
                learner_scores_for_ksb.append(sum_scores / len(row_refs))
                
            # Aggregate stats
            mean_score = sum(learner_scores_for_ksb) / cohort_size
            variance = sum((s - mean_score)**2 for s in learner_scores_for_ksb) / cohort_size
            sd_score = math.sqrt(variance)
            gap_weight = 10.0 - mean_score
            
            ksb_aggregations.append({
                'code': code,
                'mean': mean_score,
                'sd': sd_score,
                'weight': gap_weight
            })
            
        # Verify Gap Weight range
        for item in ksb_aggregations:
            assert 0.0 <= item['mean'] <= 10.0, f"Mean for {item['code']} is out of range!"
            assert 0.0 <= item['weight'] <= 10.0, f"Weight for {item['code']} is out of range!"
            
        # Distribute hours proportionally
        total_weight = sum(item['weight'] for item in ksb_aggregations)
        allocated_hours_sum = 0
        for item in ksb_aggregations:
            item['pct'] = (item['weight'] / total_weight) * 100 if total_weight > 0 else 0
            item['hours'] = round((item['pct'] / 100) * total_glh)
            allocated_hours_sum += item['hours']
            
        print(f"  Gap weight sum: {total_weight:.4f}")
        print(f"  Proportional GLH sum: {allocated_hours_sum} hrs (expected ~1000)")
        
        # Verify hour allocation
        diff = abs(allocated_hours_sum - total_glh)
        print(f"  Hours rounding difference: {diff} hrs")
        assert diff <= len(ksb_aggregations), "Hours allocation drift is too large!"
        
        print("  ✅ All mathematical and structural verifications passed.")

if __name__ == '__main__':
    run_verification()
