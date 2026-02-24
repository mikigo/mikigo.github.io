#!/usr/bin/env python3
"""
批量更新2024年博客文件的Front Matter
使其与参考文件格式一致
"""

import os
import re
from datetime import datetime

# 博客目录路径
BLOG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'docs', 'blog', '2024')

# 参考Front Matter格式
REFERENCE_FRONT_MATTER = {
    'date': '',  # 会根据文件名生成
    'authors': ['mikigo'],
    'description': '',  # 会从标题提取
    'sidebar': False,
    'pageType': 'doc-wide'
}


def update_front_matter(file_path):
    """
    更新单个文件的Front Matter
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 提取文件名中的日期
    file_name = os.path.basename(file_path)
    date_match = re.match(r'(\d{4}-\d{2}-\d{2})', file_name)
    if date_match:
        date_str = date_match.group(1)
    else:
        # 如果文件名没有日期，使用文件修改时间
        mtime = os.path.getmtime(file_path)
        date_str = datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
    
    # 提取标题作为描述
    title_match = re.search(r'^#\s+(.*)$', content, re.MULTILINE)
    if title_match:
        title = title_match.group(1)
        description = title
    else:
        description = '博客文章'
    
    # 检查是否已有Front Matter
    front_matter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if front_matter_match:
        # 替换现有的Front Matter
        new_front_matter = generate_front_matter(date_str, description)
        new_content = content.replace(front_matter_match.group(0), new_front_matter)
    else:
        # 添加新的Front Matter
        new_front_matter = generate_front_matter(date_str, description)
        new_content = new_front_matter + content
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f'Updated: {file_path}')


def generate_front_matter(date_str, description):
    """
    生成标准的Front Matter
    """
    front_matter = REFERENCE_FRONT_MATTER.copy()
    front_matter['date'] = date_str
    front_matter['description'] = description
    
    lines = ['---']
    for key, value in front_matter.items():
        if isinstance(value, list):
            lines.append(f"{key}: {value}")
        elif isinstance(value, bool):
            lines.append(f"{key}: {str(value).lower()}")
        elif key == 'date':
            lines.append(f"{key}: {value}")
        else:
            lines.append(f"{key}: '{value}'")
    lines.append('---')
    lines.append('')
    
    return '\n'.join(lines)


def main():
    """
    主函数，遍历所有博客文件并更新
    """
    if not os.path.exists(BLOG_DIR):
        print(f"Directory not found: {BLOG_DIR}")
        return
    
    for file_name in os.listdir(BLOG_DIR):
        if file_name.endswith(('.md', '.mdx')):
            file_path = os.path.join(BLOG_DIR, file_name)
            update_front_matter(file_path)
    
    print('\nAll files updated successfully!')


if __name__ == '__main__':
    main()


