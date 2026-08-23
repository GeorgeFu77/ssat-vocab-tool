import csv
import random

print("diggity dawg")

def load_words():
  with open("words.csv",encoding="utf-8",newline="") as wo:
    reader = csv.DictReader(wo)
    word = list(reader)
  return(word)
word=load_words()

print("Loaded",len(word),"words")
while True:  
  choice = input("1) View all words, 2) Search, 3) Flashcards, 4) Exit: ")
  
  if choice == "1":
      for row in word:
          print(row["word"], row["definition"], row["set"])
  
  elif choice == "2":
      search = input("What word do you want to search? ").lower().strip()
  
      found = False
  
      for row in word:
          if row["word"].lower() == search:
              print("Word:", row["word"])
              print("Definition:", row["definition"])
              print("Set:", row["set"])
              found = True
  
      if found == False:
          print("Word not found")

  elif choice == "3":
    print("works")
    answer = input("What word set would you like to review? We have 15, 16, and 17.")
    card = random.choice(word)
    if answer == "15":
      print(card["word"])
      input("Press enter to reveal definition")
      print("The definition of",card["word"],"is:",card["definition"],"and the set number of this word is",card["set"])
  
  elif choice == "4":
      quit()
  
  else:
      print("Bro it's 1, 2, 3, or 4")
