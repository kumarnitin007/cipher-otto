/**
 * ============================================================================
 * Otto's Learning Notes Utility
 * ============================================================================
 * 
 * This file contains Otto the Otter's kid-friendly learning notes for each
 * cipher type in the Cipher Otto application. These notes are designed to help
 * children and beginners understand cryptography concepts in a fun, accessible way.
 * 
 * Purpose:
 * - Educational Content: Provides step-by-step explanations of how each cipher works
 * - Kid-Friendly Language: Uses simple terms, emojis, and relatable examples
 * - Learning Tips: Includes practice suggestions and helpful hints
 * - Historical Context: Shares fun facts about cipher origins and usage
 * 
 * Structure:
 * Each cipher has a dedicated note that includes:
 * - What is it? (Simple explanation)
 * - How to Play (Step-by-step instructions)
 * - Otto's Tip (Helpful hints)
 * - Practice Examples (Hands-on exercises)
 * - Fun Facts (Historical context)
 * 
 * Usage:
 * Import getOttosNotes() and call with a cipher key to retrieve the appropriate
 * learning notes. Used in the Notes section of the Learn tab.
 * 
 * @module utils/ottosNotes
 * @see {@link getOttosNotes} Main export function
 */

/**
 * Get Otto's learning notes for a specific cipher
 * 
 * Returns a formatted string with Otto's friendly explanation, tips, and
 * practice examples for the requested cipher. If the cipher is not found,
 * returns a default message indicating that notes are being prepared.
 * 
 * @param {string} cipherKey - The key of the cipher (e.g., 'caesar', 'vigenere', 'rsa')
 * @returns {string} - Otto's friendly explanation of the cipher with emojis and examples
 * 
 * @example
 * const notes = getOttosNotes('caesar');
 * // Returns: "🦦 Hi! I'm Otto, and I'm here to help you learn the Caesar Cipher! 🎉..."
 */
export const getOttosNotes = (cipherKey) => {
  const ottosNotes = {
    caesar: `🦦 Hi! I'm Otto, and I'm here to help you learn the Caesar Cipher! 🎉

📚 What is it?
The Caesar Cipher is like a secret alphabet game! You take every letter and "shift" it forward by a certain number. For example, if you shift by 3, A becomes D, B becomes E, and so on!

Here's how the alphabet shifts with shift 3:

[[CAESAR:3]]

🎮 How to Play:
1. Pick a number between 1-25 (that's your "shift")
2. Write your message
3. Move each letter forward by your shift number
4. Wrap around: After Z comes back to A!

💡 Otto's Tip:
Try encrypting your name with shift 3! "OTTO" becomes "RXXR" - that's my secret code name! 😄 Look at the alphabet above - see how A becomes D, B becomes E? That's the shift in action!

🎯 Practice:
• Start with shift 3 (that's what Julius Caesar used!)
• Try: "HELLO" → "KHOOR" (shift 3)
• Try: "WORLD" → "ZRUOG" (shift 3)

Remember: To decrypt, just shift backwards by the same number! 🦦✨`,
      
    atbash: `🦦 Otter-ific! Let's learn the Atbash Cipher! 🎉

📚 What is it?
The Atbash Cipher is super simple - it's like looking in a mirror! A becomes Z, B becomes Y, C becomes X... you flip the whole alphabet backwards!

Here's the alphabet mirror:

[[ATBASH]]

🎮 How to Play:
• A ↔ Z (first letter ↔ last letter)
• B ↔ Y
• C ↔ X
• And so on!

💡 Otto's Tip:
It's like a secret handshake with the alphabet! The alphabet does a complete backflip! 🔄 Look at the mirror above - see how each letter pairs with its opposite?

🎯 Practice:
• "PIZZA" → "KRAZZ" (try it!)
• "HELLO" → "SVOOL"
• "OTTO" → "L G G L" (that's me in Atbash!)

Fun Fact: This cipher is over 2000 years old! It's one of the oldest ciphers ever! 🦦✨`,
      
    aristocrat: `🦦 Detective time! Let's solve the Aristocrat Cipher! 🕵️‍♂️

📚 What is it?
The Aristocrat Cipher is like a word puzzle where each letter stands for a different letter. But here's the cool part - spaces stay in the same places! So you can still see where words begin and end!

🎮 How to Play:
• Every letter gets replaced with another letter
• Spaces stay in the same place
• It's like a secret code where A might become Z, B might become E, etc.

💡 Otto's Tip:
Look for common words! 
• "THE" is the most common word in English
• "AND" is super common too
• Short words like "A", "I", "TO" give you clues!

🎯 Practice Tips:
• Start by finding "THE" - it appears a lot!
• Look for patterns in short words
• Count how often each letter appears (frequency analysis)

Remember: Being a code detective takes practice, but you've got this! 🦦✨`,
      
    affine: `🦦 Math time! The Affine Cipher uses MATH to make codes! 🧮

📚 What is it?
The Affine Cipher uses a special formula: (a × letter + b) mod 26
Don't worry - I'll explain it simply!

🎮 How to Play:
• "a" is a multiplier (must be 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, or 25)
• "b" is a shift number (0-25)
• For each letter, we do some math!

💡 Otto's Tip:
Think of it like this:
• First, multiply the letter by "a"
• Then, add "b"
• Finally, wrap around if needed (that's the "mod 26" part)

🎯 Example:
If a=5 and b=8:
• A (0) → (5×0 + 8) mod 26 = 8 → I
• B (1) → (5×1 + 8) mod 26 = 13 → N

Fun Fact: The Caesar Cipher is actually a special case of Affine where a=1! 🦦✨`,
      
    nihilist: `🦦 Spy code alert! The Nihilist Cipher is what Russian spies used! 🔢

📚 What is it?
The Nihilist Cipher uses a grid (like a secret map!) and then adds numbers together. It's like a math puzzle with letters!

🎮 How to Play:
1. Make a 5×5 grid with letters (called a Polybius Square)
2. Find each letter's position in the grid (like row 2, column 3)
3. Turn that into a number (like 23)
4. Add numbers from a keyword to make it secret!

Here's what a Polybius Square looks like with keyword "CRYPTO":

[[POLYBIUS:CRYPTO]]

💡 Otto's Tip:
Think of it like coordinates on a map! The grid has rows (1-5) and columns (1-5). Each letter lives at a specific spot! Look at the square above - see how each letter has a row number and column number? That's how you find coordinates!

🎯 Practice:
• Use the Polybius Square above with keyword "CRYPTO"
• Find letter "H" in the grid - it's at row 2, column 3, so that's 23!
• Add your keyword's number to it to encrypt!

This was used by Russian revolutionaries in the 1880s! Super spy stuff! 🦦✨`,
      
    checkerboard: `🦦 Cold War secrets! The Straddling Checkerboard is REAL spy code! 🌐

📚 What is it?
This cipher creates a special board where some letters get one digit, and others get two digits. It's like a secret number system! It uses a Polybius Square as the base, but with special "blank" columns.

🎮 How to Play:
• Create a Polybius Square with a keyword
• Mark some columns as "blank" (usually columns 2 and 6)
• Letters in regular spots = one digit (like 0, 1, 3, 4, 5, 7, 8, 9)
• Letters in blank column spots = two digits (like 20, 21, 60, 61)

Here's a basic Polybius Square (the checkerboard builds on this):

[[POLYBIUS:CRYPTO]]

💡 Otto's Tip:
The "blank" columns make it tricky! Some letters need one number, others need two numbers. It's like a secret code where the length itself is a clue! The checkerboard uses a Polybius Square but adds blank columns to make it even more secure.

🎯 Practice:
• Start with a Polybius Square (like the one above)
• Mark columns 2 and 6 as blank
• Fill the regular spots first
• Then use the blank columns for the rest

Fun Fact: Soviet spies used this during the Cold War! It's a real spy technique! 🦦✨`,
      
    columnar: `🦦 Shuffle time! The Columnar Cipher rearranges your message! 📋

📚 What is it?
The Columnar Cipher writes your message in rows, then reads it in a different order based on a keyword. It's like shuffling a deck of cards!

Here's how it works with "HELLO WORLD" and keyword "KEY":

[[COLUMNAR:HELLO WORLD:KEY]]

🎮 How to Play:
1. Write your message in rows (like a table)
2. Use a keyword to decide the order of columns
3. Read the columns in that special order!

💡 Otto's Tip:
Think of it like this: You write your message normally in rows, but then you read it by columns in a scrambled order based on your keyword! Look at the grid above - see how the keyword determines which column to read first?

🎯 Practice:
• Try with different keywords - "CRYPTO", "SECRET", "KEY"
• Each keyword creates a different column order!
• The longer the keyword, the more columns you have!

It's like magic - the letters dance around! 🦦✨`,
      
    baconian: `🦦 Binary from the 1600s! The Baconian Cipher uses only A and B! 🥓

📚 What is it?
Francis Bacon invented a way to hide messages using only the letters A and B! Each letter of the alphabet gets a special 5-letter code made of A's and B's!

Here's the complete Baconian encoding table:

[[BACONIAN]]

🎮 How to Play:
• Each letter has a unique 5-letter code of A's and B's
• Look up your letter in the table above
• Replace it with its A/B code!

💡 Otto's Tip:
It's like binary code, but with letters! Each real letter becomes 5 A's or B's. It's like a secret language where only A and B exist! Look at the table above - see how each letter has its own unique pattern?

🎯 Practice:
• "HELLO" becomes: AABAA AABAB ABABA ABABA ABBAB (check the table!)
• Try to decode: AAAAA AABAA AAABA AAABA ABBAB (hint: it spells "APPLE")
• Each 5-letter group stands for one letter!

Fun Fact: This was invented in 1605! Way before computers had binary! 🦦✨`,
      
    porta: `🦦 Renaissance magic! The Porta Cipher uses 13 alphabets! 🎭

📚 What is it?
The Porta Cipher was created in 1563 by Giovanni Battista della Porta. It uses 13 different alphabets, and the coolest part? It's self-reciprocal - encryption and decryption work the same way!

Here's the complete Porta cipher table with all 13 alphabets:

[[PORTA]]

🎮 How to Play:
• Use a keyword to pick which alphabet to use
• Each letter pair (like AB, CD, EF) has its own special alphabet
• Find your keyword letter's pair in the table above, then use that alphabet row!

💡 Otto's Tip:
It's like having 13 different secret languages! Your keyword letter tells you which language to use. Look at the table above - see how each letter pair (AB, CD, EF, etc.) has its own alphabet? When your keyword letter is "K", it's in pair "KL", so you use the KL row! And the magic part? To decrypt, you just encrypt again with the same keyword!

🎯 Practice:
• Start with keyword "KEY"
• Letter K is in pair KL - find the KL row in the table above
• Letter E is in pair EF - find the EF row
• Letter Y is in pair YZ - find the YZ row
• Use each row's alphabet to encrypt your message!

This cipher is over 450 years old! 🦦✨`,
      
    patristocrat: `🦦 No spaces challenge! The Patristocrat Cipher removes all spaces! 🔤

📚 What is it?
The Patristocrat Cipher is just like the Aristocrat Cipher, but harder! Why? Because it removes ALL spaces between words. So you can't tell where one word ends and another begins!

🎮 How to Play:
• Each letter gets replaced with another letter
• BUT all spaces are removed
• So "HELLO WORLD" becomes "HELLOWORLD" then gets encrypted

💡 Otto's Tip:
This makes it much harder to crack! Without spaces, you can't see word boundaries. It's like reading a sentence without any punctuation - tricky!

🎯 Practice:
• Start with a simple message
• Remove all spaces
• Then apply letter substitution
• Try to decrypt without spaces - it's a challenge!

Remember: This is the same as Aristocrat but without word breaks! 🦦✨`,
      
    cryptarithm: `🦦 Math puzzle time! Cryptarithms are like word math! 🧩

📚 What is it?
A Cryptarithm is a puzzle where letters stand for digits. Each letter must be a different digit, and the math must work out correctly!

🎮 How to Play:
• Each letter = one unique digit (0-9)
• The equation must be mathematically correct
• No letter can be the same digit as another letter
• Numbers can't start with 0

💡 Otto's Tip:
Start with the most important letters! Look at the result column - those letters are key! Also, if a number has 4 digits and another has 5, the result tells you about the first digit!

🎯 Famous Example:
SEND + MORE = MONEY
• S=9, E=5, N=6, D=7
• M=1, O=0, R=8, Y=2
• 9567 + 1085 = 10652 ✓

Try solving it yourself! It's like a detective story with numbers! 🦦✨`,
      
    fractionatedMorse: `🦦 Morse code + substitution = AWESOME! 📡

📚 What is it?
Fractionated Morse combines Morse code with keyword substitution! First, your message becomes Morse code (dots and dashes), then it gets grouped into triplets, and finally those triplets become letters!

First, you need to know Morse code! Here's the chart:

[[MORSE]]

🎮 How to Play:
1. Convert your message to Morse code using the chart above (. - x)
2. Group the Morse into triplets (like ... or ..- or .x.)
3. Use a keyword table to convert triplets to letters

💡 Otto's Tip:
Think of it in three steps:
• Step 1: Text → Morse code (use the chart above!)
• Step 2: Morse → Triplets (groups of 3)
• Step 3: Triplets → Letters (using keyword table)

🎯 Practice:
• Start with "HELLO"
• Convert to Morse (from chart): .... . .-.. .-.. ---
• Add separators (x): ....x .x .-..x .-..x ---x
• Group into triplets
• Convert to letters using your keyword!

This is a favorite in cryptography competitions! 🦦✨`,
      
    xenocrypt: `🦦 ¡Hola! Let's learn Xenocrypt - the Spanish cipher! 🇪🇸

📚 What is it?
Xenocrypt is like the Aristocrat Cipher, but for Spanish! It uses the special Spanish alphabet with 27 letters (A-Z plus Ñ!). It's perfect for Spanish text!

🎮 How to Play:
• Works exactly like Aristocrat cipher
• BUT uses the Spanish alphabet: A B C D E F G H I J K L M N Ñ O P Q R S T U V W X Y Z
• Accented letters (Á, É, Í, Ó, Ú) get converted to regular letters

💡 Otto's Tip:
The Spanish alphabet has Ñ! That's letter number 15. So when you're encrypting Spanish text, make sure to include Ñ in your substitution key!

🎯 Practice:
• Try encrypting "HOLA MUNDO" (Hello World in Spanish)
• Remember: Ñ is a special letter!
• Accented letters become regular letters (Á→A, É→E)

Fun Fact: This is popular in cryptography competitions! 🦦✨`,
      
    railfence: `🦦 All aboard! The Rail Fence Cipher zigzags like a train! 🚂

📚 What is it?
The Rail Fence Cipher writes your message in a zigzag pattern across multiple "rails" (rows), then reads it horizontally. It's like writing on train tracks!

Here's how "HELLO WORLD" looks with 3 rails:

[[RAILFENCE:HELLO WORLD:3]]

🎮 How to Play:
1. Pick a number of rails (2-10)
2. Write your message in a zigzag pattern
3. When you hit the top or bottom rail, bounce back!
4. Read the message horizontally from all rails

💡 Otto's Tip:
Think of it like this: You write your message going down the rails, bouncing back and forth like a pinball! Then you read it straight across. Look at the visualization above - see how the letters zigzag? That's the pattern!

🎯 Practice:
• Try with 2 rails (simpler zigzag)
• Try with 4 or 5 rails (more complex pattern)
• Each number of rails creates a different encrypted message!

Try it with different numbers of rails! 🦦✨`,
      
    pollux: `🦦 Morse to numbers! Pollux transforms Morse code into digits! 🔢

📚 What is it?
Pollux converts your message to Morse code first (dots and dashes), then each dot and dash gets replaced with a digit. It's like a secret number language!

First, you need to know Morse code! Here's the chart:

[[MORSE]]

🎮 How to Play:
1. Convert text to Morse code using the chart above (. and -)
2. Replace each . and - with a digit
3. Default: . = 5, - = 8
4. Add separators (x) between letters

💡 Otto's Tip:
The mapping is simple:
• Dot (.) becomes a digit (like 5)
• Dash (-) becomes a different digit (like 8)
• Separator (x) becomes a space
• Use the Morse code chart above to convert letters first!

🎯 Practice:
• "HELLO" → Morse (from chart): .... . .-.. .-.. ---
• With mapping . = 5, - = 8
• Becomes: 5555 5 58 55 55 888

Try decoding those numbers back! 🦦✨`,
      
    morbit: `🦦 Double digits! Morbit is like Pollux but with pairs! 🔢

📚 What is it?
Morbit is similar to Pollux, but it groups the Morse code symbols into pairs of digits. So instead of single digits, you get pairs like 11, 22, 33!

First, learn Morse code with this chart:

[[MORSE]]

🎮 How to Play:
1. Convert text to Morse code using the chart above
2. Replace . with one digit (like 1)
3. Replace - with another digit (like 2)
4. Replace x with a third digit (like 3)
5. Group everything into pairs

💡 Otto's Tip:
It's like Pollux, but with extra steps! The pairs make it a bit more complex. Default mapping: . = 1, - = 2, x = 3. Use the Morse code chart above to convert your letters first!

🎯 Practice:
• "HELLO" → Morse (from chart): ....x .x .-..x .-..x ---x
• With mapping . = 1, - = 2, x = 3
• Becomes: 1111 3 1 3 12 11 3 12 11 3 222 3
• Group into pairs: 11 11 31 31 21 13 12 11 32 22 3

You've got this! 🦦✨`,
      
    vigenere: `🦦 Keyword power! Vigenère is like Caesar but WAY stronger! 🔑

📚 What is it?
The Vigenère Cipher uses a keyword to create multiple Caesar ciphers! Each letter of your keyword tells you how much to shift. It's like having different shift amounts for each letter!

Here's the Vigenère Square (Tabula Recta) - this is the secret table that makes it work:

[[VIGENERE]]

🎮 How to Play:
1. Pick a keyword (like "KEY")
2. Write your message
3. For each letter, use the corresponding keyword letter to determine the shift
4. Find the intersection in the Vigenère Square above!

💡 Otto's Tip:
The keyword repeats! If your keyword is "KEY" and your message is "HELLO", you use:
• H (message) + K (keyword) = Find row H, column K in the square above = R
• E (message) + E (keyword) = Find row E, column E = I
• L (message) + Y (keyword) = Find row L, column Y = J
• L (message) + K (keyword) = Find row L, column K = V (keyword repeats!)
• O (message) + E (keyword) = Find row O, column E = S

🎯 Example:
Message: "HELLO" with keyword "KEY"
• H + K = R (use the square above!)
• E + E = I
• L + Y = J
• L + K = V
• O + E = S
Result: "RIJVS"

Much stronger than Caesar! 🦦✨`,
      
    rsa: `🦦 Prime number magic! RSA uses math to keep secrets safe! 🔐

📚 What is it?
RSA is a public-key cipher that uses prime numbers! You have two keys - one public (for encrypting) and one private (for decrypting). This is simplified for learning!

🎮 How to Play:
• Public key: (n, e) - anyone can use this to encrypt
• Private key: (n, d) - only you can use this to decrypt
• Encryption: letter^e mod n
• Decryption: number^d mod n

💡 Otto's Tip:
Think of it like this:
• Public key = a lock (anyone can lock something)
• Private key = the key (only you can unlock)
• Real RSA uses HUGE prime numbers (hundreds of digits!)
• This version is simplified for learning

🎯 Practice:
• Convert letter to number (A=1, B=2, etc.)
• Raise to power e, then mod n
• To decrypt, raise to power d, then mod n

Fun Fact: Real RSA keeps the internet safe! This is a simplified version for learning! 🦦✨`,
      
    aristocratMisspelled: `🦦 Extra tricky! Aristocrat Misspelled adds intentional mistakes! 🔤

📚 What is it?
This is like the regular Aristocrat Cipher, but with intentional misspellings! Common words get spelled wrong on purpose to make frequency analysis harder!

🎮 How to Play:
• Works like Aristocrat cipher
• BUT first, some words get misspelled:
  • "THE" → "TEH"
  • "AND" → "NAD"
  • "YOU" → "YUO"
• Then you apply letter substitution

💡 Otto's Tip:
The misspellings make it harder! Without correct spelling, it's tougher to find common words like "THE" and "AND". It's like a code with extra puzzles!

🎯 Practice:
• Start with a message
• Apply common misspellings
• Then encrypt with letter substitution
• To decrypt, reverse both steps!

Remember: Fix the misspellings after decrypting! 🦦✨`,
      
    dancingMen: `🦦 Sherlock Holmes cipher! Dancing Men are secret stick figures! 💃

📚 What is it?
The Dancing Men Cipher represents each letter as a stick figure in a different pose! It was made famous in "The Adventure of the Dancing Men" by Arthur Conan Doyle!

🎮 How to Play:
• Each letter = a different stick figure pose
• Write your message using the dancing men figures
• To decrypt, match the figures back to letters

💡 Otto's Tip:
It's like emoji code from the 1800s! Each dancing man has a unique pose that stands for a letter. Some might be waving, some might be standing, some might be dancing!

🎯 Practice:
• A might be 🕺 (waving)
• B might be 💃 (dancing)
• C might be 👯 (hands up)
• And so on!

Fun Fact: Sherlock Holmes solved this in the story! 🦦✨`,
      
    hill2x2: `🦦 Matrix magic! Hill 2x2 uses math matrices! 📐

📚 What is it?
The Hill Cipher uses matrix multiplication to encrypt pairs of letters! It's like math meets cryptography! You need a 2×2 matrix (a grid with 4 numbers).

Here's how matrix multiplication works:

[[HILL2X2]]

🎮 How to Play:
1. Pick a 2×2 matrix (like [[3,3],[2,5]])
2. Take letters in pairs
3. Convert letters to numbers (A=0, B=1, etc.)
4. Multiply by the matrix (see visualization above!)
5. Convert back to letters!

💡 Otto's Tip:
Think of it like this:
• Letters become numbers
• Numbers get multiplied by a matrix
• The result becomes new numbers
• New numbers become new letters!
• Look at the visualization above to see the steps!

🎯 Example:
Pair "HE" (H=7, E=4)
• Matrix [[3,3],[2,5]] × [7,4]
• = [3×7 + 3×4, 2×7 + 5×4]
• = [33, 34] mod 26 = [7, 8] = HI

Math is cool! 🦦✨`,
      
    hill3x3: `🦦 Bigger matrices = bigger security! Hill 3x3 is even stronger! 📐

📚 What is it?
Hill 3x3 is like Hill 2x2, but bigger! Instead of encrypting pairs of letters, it encrypts triplets (groups of 3 letters) using a 3×3 matrix!

Here's how 3×3 matrix multiplication works:

[[HILL3X3]]

🎮 How to Play:
1. Pick a 3×3 matrix (9 numbers in a grid)
2. Take letters in groups of 3
3. Convert to numbers
4. Multiply by the 3×3 matrix (see visualization above!)
5. Convert back to letters!

💡 Otto's Tip:
It's the same idea as 2x2, but with triplets! The matrix is bigger (3×3 instead of 2×2), so you process 3 letters at once instead of 2! Look at the visualization above to see how triplets get transformed!

🎯 Example:
Triplet "HEL" (H=7, E=4, L=11)
• Use 3×3 matrix
• Multiply all three numbers together
• Get three new numbers
• Convert to three new letters!

More math = more security! 🦦✨`
  };
  
  return ottosNotes[cipherKey] || `🦦 Hi there! I'm still learning about this cipher myself! But I'm working hard to create awesome notes for you. Check back soon! 🦦✨`;
};

