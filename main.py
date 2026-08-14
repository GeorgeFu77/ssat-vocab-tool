import csv 
print("diggity dawg")
words=open("words.csv") 
reader=csv.DictReader(words)
word=list(reader) 
print(len(word))
