import os
import json

groups = [
    "小学",
    "初中",
    "高中",
    "四级",
    "六级",
]


for i in os.listdir("./books"):

    with open(f"./books/{i}", "r", encoding="utf-8") as f:
        lines = f.readlines()

    g = None
    for group in groups:
        if i.startswith(group):
            g =  group
            break
    else:
        continue
    if g is None:
        raise ValueError

    if not os.path.exists(f"../docs/english/{g}"):
        os.mkdir(f"../docs/english/{g}")

    with open(f"../docs/english/{g}/{os.path.splitext(i)[0]}.md", "w", encoding="utf-8") as mdf:
        mdf.write(f"# {os.path.splitext(i)[0]}\n\n")
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
            phone = content.get("phone")
            for t in trans:
                # mdf.write(f"**{t.get('descCn')}**\n\n")
                mdf.write(f"{f'`{phone}`  ' if phone else ''}**{t.get('tranCn')}**\n\n")
                # if t.get('descOther'):
                #     mdf.write(f"**{t.get('descOther')}**\n\n")
                #     mdf.write(f"{t.get('tranOther')}\n\n")

            # 短语
            phrase: dict = content.get("phrase")
            if phrase:
                mdf.write(f":::tip{{title=🤩{phrase.get('desc')}}}\n\n")
                for p in phrase.get('phrases'):
                    pCn = p.get('pCn')
                    pContent = p.get('pContent')
                    mdf.write(f"- {pContent} （{pCn}）\n\n")
                mdf.write(f":::\n\n")

            # 例句
            sentence: dict = content.get("sentence")
            if sentence:
                mdf.write(f":::note{{title=🎤{sentence.get('desc')}}}\n\n")
                for s in sentence.get('sentences'):
                    mdf.write(f"- {s.get('sContent')} （{s.get('sCn')}）\n\n")
                mdf.write(f":::\n\n")

            # 同义词
            syno: dict = content.get("syno")
            if syno:
                mdf.write(f":::warning{{title=🤔同义词}}\n\n")
                for s in syno.get('synos'):
                    hwds = s.get('hwds')
                    l = []
                    for h in hwds:
                        l.append(h.get('w'))
                    l = ", ".join(l)
                    l += f" （{s.get('tran')}）"
                    mdf.write(f"- {l}\n\n")
                mdf.write(f":::\n\n")



