import csv 
print("diggity dawg")
words=open("words.csv") 
reader=csv.DictReader(words)
word=list(reader) 
print(len(word))

choice = input("1) View all words, 2) Search, 3) Exit")
if(choice == "1"):
  print("words")
