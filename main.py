import csv

print("diggity dawg")

words = open("words.csv")
reader = csv.DictReader(words)
word = list(reader)

print(len(word))
while True:  
  choice = input("1) View all words, 2) Search, 3) Exit: ")
  
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
      quit()
  
  else:
      print("you are actually stupid")
