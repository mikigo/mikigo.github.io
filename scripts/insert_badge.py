import os
import re

# 要插入的内容
insert_content = '''import { Badge } from '@rspress/core/theme'; 

<Badge type="tip"> 
  <img 
    style={{ height: '24px' }} 
    src="/logo.png" 
  /> 
  <span>mikigo</span> 
</Badge>
'''

# 遍历 docs\program\ 目录下的所有 .mdx 文件
for root, dirs, files in os.walk('docs\\tech_doc'):
    for file in files:
        if file.endswith('.mdx'):
            file_path = os.path.join(root, file)
            print(f'Processing {file_path}')
            
            # 读取文件内容
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 查找一级标题
            pattern = r'^# (.+)$'
            match = re.search(pattern, content, re.MULTILINE)
            
            if match:
                # 在一级标题后插入内容
                new_content = content.replace(match.group(0), match.group(0) + '\n\n' + insert_content, 1)
                
                # 写回文件
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f'Updated {file_path}')
            else:
                print(f'No level 1 heading found in {file_path}')

print('All files processed.')