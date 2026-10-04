import csv
import random

print("diggity dawg")


def load_words():
    with open("words.csv", encoding="utf-8", newline="") as wo:
        reader = csv.DictReader(wo)
        word = list(reader)
        return word


word = load_words()

print("Loaded", len(word), "words")

while True:
    choice = input("1) View all words, 2) Search, 3) Flashcards, 4) Quiz, 5) Exit: ")

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
        while True:
            card = random.choice(word)
            print(card["word"])
            input("Press enter to reveal definition")
            print(
                "The definition of",
                card["word"],
                "is:",
                card["definition"],
                "and the set number of this word is",
                card["set"]
            )

            sme = input("Enter for next card, or press q to quit: ").lower().strip()

            if sme == "q":
                break

    elif choice == "4":
      counter = 0
      score = 0
      missed = []
  
      while counter < 10:
          Wcard = random.choice(word)
  
          print("\nQuestion", counter + 1)
          print("What does", Wcard["word"], "mean?")
  
          incorrect_answers = []
  
          while len(incorrect_answers) < 3:
              wrong_card = random.choice(word)
              wrong_answer = wrong_card["definition"]
  
              if wrong_answer != Wcard["definition"] and wrong_answer not in incorrect_answers:
                  incorrect_answers.append(wrong_answer)
  
          answers = incorrect_answers + [Wcard["definition"]]
          random.shuffle(answers)
  
          for i, answer in enumerate(answers):
              print(str(i + 1) + ".", answer)
  
          answer = input("Your answer (1-4): ").strip()
  
          if answer.isdigit() and 1 <= int(answer) <= 4:
              selected_answer = answers[int(answer) - 1]
  
              if selected_answer == Wcard["definition"]:
                  print("Correct!")
                  score += 1
              else:
                  print("Incorrect!")
                  print("The correct answer was:", Wcard["definition"])
                  missed.append(Wcard)
  
          else:
              print("Invalid choice!")
              print("The correct answer was:", Wcard["definition"])
              missed.append(Wcard)
  
          counter += 1
  
      print("\nQuiz finished!")
      print("You got", score, "out of 10 correct.")
  
      if len(missed) == 0:
          print("No missed words!")
        
      else:
          print("Words to study:")
          for card in missed:
              print(card["word"], "-", card["definition"])
    elif choice == "5":
        quit()

    else:
        print("Bro it's 1, 2, 3, 4, or 5")
