import os
import json

groups = [
    "人教版小学",
    "人教版初中",
    "人教版高中",
    "四级",
    "六级",
    "考研",
    "雅思",
    "新东方",
    "专四",
    "专八",
]

with open("./bookLists.txt", "r", encoding="utf-8") as f:
    txt = json.load(f)

books = txt.get("data").get("normalBooksInfo")


for i in os.listdir("./books"):

    title = None
    for book in books:
        if book.get("id") == os.path.splitext(i)[0]:
            title = book.get("title")
            break
    if title is None:
        raise ValueError

    with open(f"./books/{i}", "r", encoding="utf-8") as f:
        lines = f.readlines()

    g = None
    for group in groups:
        if title.startswith(group):
            g =  group
            break
    else:
        continue
    if g is None:
        raise ValueError

    if not os.path.exists(f"../docs/english/{g}"):
        os.mkdir(f"../docs/english/{g}")

    with open(f"../docs/english/{g}/{title}.md", "w", encoding="utf-8") as mdf:
        mdf.write(f"# {title}\n\n")
        for line in lines:

            line = line.strip()
            if not line.startswith("{"):
                continue

            json_data = json.loads(line)
            wordRank: int = json_data.get("wordRank")
            wordHead: str = json_data.get("headWord")
            content: dict = json_data.get("content").get("word").get("content")
            mdf.write(f"## {wordRank}. {wordHead}\n\n")

            # 翻译
            trans: list = content.get("trans")
            for t in trans:
                mdf.write(f"**{t.get('descCn')}**\n\n")
                mdf.write(f"{t.get('tranCn')}\n\n")
                if t.get('descOther'):
                    mdf.write(f"**{t.get('descOther')}**\n\n")
                    mdf.write(f"{t.get('tranOther')}\n\n")

            # 短语
            phrase: dict = content.get("phrase")
            if phrase:
                mdf.write(f"**{phrase.get('desc')}**\n\n")
                for p in phrase.get('phrases'):
                    pCn = p.get('pCn')
                    pContent = p.get('pContent')
                    mdf.write(f"{pContent} ({pCn})\n\n")

            # 例句
            sentence: dict = content.get("sentence")
            if sentence:
                mdf.write(f"**{sentence.get('desc')}**\n\n")
                for s in sentence.get('sentences'):
                    mdf.write(f"{s.get('sContent')}\n\n")
                    mdf.write(f"{s.get('sCn')}\n\n")

            # 同义词
            syno: dict = content.get("syno")
            if syno:
                mdf.write(f"**{syno.get('desc')}**\n\n")
                for s in syno.get('synos'):
                    hwds = s.get('hwds')
                    l = ""
                    for h in hwds:
                        l += f"{h.get('w')}"
                    l += f" ({s.get('tran')})"
                    mdf.write(f"{l}\n\n")



