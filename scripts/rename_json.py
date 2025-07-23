import json
import os
import shutil

groups = [
    "人教版小学",
    "人教版初中",
    "人教版高中",
    "四级",
    "六级",
]

with open("./bookLists.txt", "r", encoding="utf-8") as f:
    txt = json.load(f)

books = txt.get("data").get("normalBooksInfo")


for j in os.listdir("./dict"):

    for book in books:
        id = book.get("id")
        title: str = book.get("title")
        for g in groups:
            if title.startswith(g):
                if j == f"{id}.json":
                    shutil.copy(f"./dict/{j}", f"./books/{title}.json")
