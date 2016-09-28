# BitBang

*I like BrainFuck, but why can't it be 8 times harder?*

BitBang is an esoteric programming language inspired by BrainFuck.  It however has two fewer character/instruction and is even harder to write, yay!

All symbols operate almost identically, except that `+`, `-`, and `>` are replaced with `!`. Instead of operating on one byte of memory at a time, BitBang operates an a single bit.  `!` inverts the value at pointer's address, and advances the pointer address by one.

## Syntax

BitBang instructions affect the memory pointer and the value at the pointer.  In the techinal sense, an infinite amount of memory is required. Each address must have a value of 0 or 1.  When the program starts, all memory should be 0 and the pointer should be at the 0 address.  The following shows the program memory, and the pointer at start up:

```
000000000000000...
^
pointer location
```

The `!` instruction inverts the current bit and advances the pointer 1. As an Example:

```
// result of !
100000000000000...
 ^
```

The `<` instruction regresses the pointer 1. As an example:

```
// result of !<
100000000000000...
^
```

The `[]` defines a loop and can contain any number of instructions.  Each `[` must have a matching `]` and vice versa.  When an `[` is encountered, if the value at the pointer is 1, the program will proceed to the next instruction.  If 0, it will jump to the instruction after the matching `]`.  When a `]` is encountered, the program will always jump to the matching `[`.

In the following example, because the value is 1 when the `[` is encountered, the contained instructions are excuted, in this case, flipping the 1 to 0 and advancing the pointer.  The loop then exits, because the value at the pointer is 0.

```
// result of !<[!]
000000000000000...
 ^
```

In this example, the second loop never executes, because the value of the pointer address is 0, so no additional bits are inverted.

```
// result of !<[!][!!!!]
000000000000000...
 ^
```

The `.` and `,` instructions are for input and output.  The `.` outputs the value of the pointer address, and the `,` sets the pointers address to the value recieved as input.

## Turing Completeness

*Hey look, a deeper tar pit!*

I have chosen to prove turing completeness by implementation of another turing complete language, specifically--and for obvious reasons--BrainFuck!

The crux of this proof rests in implementing each individual instruction of BrainFuck (which acts on 1 byte) with a combination of 1 bit instructions.  18 bits are used per BrainFuck byte, eight representing the corresponding BrainFuck value (big endian), two used as while bit and the while helper bit, and eight serving as inc/dec helper bits.

```
      while & helper
           vv
00000000   00   00000000
^      ^        ^      ^
bf value     inc/dec helpers
```

We consider the pointer on the big end of the value to be at "rest."

### <

This one is pretty straightforward, we skip over the BrainFuck value, the while bit, and all helpers bits:

```brainfuck
<<<<<<<<<<<<<<<<<
```

### >

This one is a bit more involved, since we don't have a right shift equivalent.  However, since `!` advances the pointer, we can just do it twice to counteract its effects.

```brainfuck
// advance 1 bit, without affecting any values
!<!

// advance 18 bits
!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!
```

### .

Now that we know how to advance our pointer, and assuming we input/output from the big end of the byte, we can implement the equivalent of `.`.

```brainfuck
.!<!.!<!.!<!.!<!.!<!.!<!.!<!.!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!
```

### ,

I'm guessing you can solve this one...

```brainfuck
,!<!,!<!,!<!,!<!,!<!,!<!,!<!,!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!
```

### +

Okay a tough one!  First we're going to establish an if/else structure, that utilizes our inc/dec helper bit, which is always exactly ten bits to the right.  We'll generalize here for a helper bit that is `x` distance to the right.

```brainfuck
// Flip the current bit, and return to its address
!<

// Force to 0:
[!<]

// Force to 1:
[!<]!<

// Execute exactly once if 1:
!<!      // move to the helper bit (repeat x times)
[!<]     // zero out the helper bit
<        // move back to the conditional bit (repeat x times)
[        // if conditional bit is 1
  !<!    // move to the helper bit (repeat x times)
  [!<]!< // set the helper bit to 1
  <      // move to the conditional bit (repeat x times)
  /*
    any code that returns to the conditional bit and
    that does not affect the conditional or helper bit
  */
  !<     // zero out conditional bit to force end the loop
]
!<!      // move to the helper bit (repeat x times)
[        // if the helper bit is 1
  <      // move back to the conditional bit (repeat x times)
  [!<]!< // set the conditional bit to 1
  !<!    // move back to the helper bit (repeat x times)
  !<     // zero out conditional bit to force end the loop
]
< // return to conditional bit (repeat x times)
```

Based on that, we can now define the "execute exactly once if 0" pattern, simply by inverting the conditional bit before and after running the "execute exactly once if 1" pattern.

In this example, we show a helper bit 10 bits away and remove some redundant instructions such as `!<!<`.

```brainfuck

Execute exactly once if 0
!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
  /*
    any code that returns to the conditional bit and
    that does not affect the conditional or helper bit
  */
]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
```

Now for our increment.  We flip the current bit, and if it's zero we need to carry and continue--at least until we run out of available bits (8).  Note how at the end of the "body" of each "if" statement, we always return to the address where the statement started.

```brainfuck
// increment the little end of our value
!<!!<!!<!!<!!<!!<!!<!!<
// if 0 {
!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
  // carry
  <!<
  // if 0 {
  !!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
    // carry
    <!<
    // if 0 {
    !!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
      // carry
      <!<
      // if 0 {
      !!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
        // carry
        <!<
        // if 0 {
        !!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
          // carry
          <!<
          // if 0 {
          !!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
            // carry
            <!<
            // if 0 {
            !!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
              // carry
              <!<
              // reached our maximum bits
              // move our address to counter our carry motion
              !<!
            // }
            ]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
            // move our address to counter our carry motion
            !<!
          // }
          ]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
          // move our address to counter our carry motion
          !<!
        // }
        ]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
        // move our address to counter our carry motion
        !<!
      // }
      ]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
      // move our address to counter our carry motion
      !<!
    // }
    ]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
    // move our address to counter our carry motion
    !<!
  // }
  ]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
  // move our address to counter our carry motion
  !<!
// }
]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<!<
return to the big end of our value
<<<<<<<
```

### -

Well, this one isn't too far away from the previous.  The only fundamental difference is that we're going to borrow instead of carry.  When the result of the `!<` is a 1, it means we need to borrow.

```brainfuck
!<!!<!!<!!<!!<!!<!!<!!<
!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
  <!<
  !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
    /* and so on */
  ]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  !<!
]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
<<<<<<<
```

### []

Lastly, we have the "while" loop symbols, which are also fairly difficult.  We now use our while bit and while helper bit.  We set the while bit to 1 if any of the BrainFuck value bits are 1.  If that's one, we exexecute our code block.

Here we break down how we set the while bit to 1 if a value bit is 1:

```brainfuck
         value bit
             v
value bit > 0000 < value helper bit
              ^
       while helper bit

// starting from the while bit
<           // move to the first value
[           // if the value is 1
  !<!       // move to the while bit
  [!<]!<    // set to 1
  !<!       // jump the while helper bit
  !<!       // move to the value helper bit
  [!<]!<    // set to 1
  <<<       // return to the value bit
  !<        // zero it out to end the loop
]
!<!!<!!<!   // move to the value helper bit
[           // if it is 1
  <<<       // move back to the value bit
  [!<]!<    // set it to 1
  !<!!<!!<! // move to the value helper bit
  !<        // set it to 0 to end the loop
]
<<<         // move back to the value bit
```

Doing this for each bit, we can construct our while loop.  Each time we start one more address to the left, so the while bit is one address over relative to our starting point:

```brainfuck
// set the while bit to 1 so we can enter the loop
!<!!<!!<!!<!!<!!<!!<!!<![!<]!<
[
  // set the while bit to 0 to prevent infinite looping
  [!<]
  // if the first BrainFuck value bit is 1 set the while loop to 1
  <[!<![!<]!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  // if the second BrainFuck value bit is 1 set the while loop to 1
  <[!<!!<![!<]!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  // and so on
  <[!<!!<!!<![!<]!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  <[!<!!<!!<!!<![!<]!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  <[!<!!<!!<!!<!!<![!<]!!<!!<!!<!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  <[!<!!<!!<!!<!!<!!<![!<]!!<!!<!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  <[!<!!<!!<!!<!!<!!<!!<![!<]!!<!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  <[!<!!<!!<!!<!!<!!<!!<!!<![!<]!!<![!<]!<<<<<<<<<<<!<]!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<<<<
  // return to the while bit
  !<!!<!!<!!<!!<!!<!!<!!<!
  // if 1 {
  !<![!<]<[!<![!<]!<<
    // return to the big end of the value
    <<<<<<<<
    /*
      contents of the while loop
    */
    // return to the while bit
    !<!!<!!<!!<!!<!!<!!<!!<!
  // }
  !<]!<![<[!<]!<!<!!<]<
// if the while bit was 1 continue looping
]
// return the pointer to the big end of the BrainFuck value
<<<<<<<<
```

## FAQ

*It's as easy as `!<!!!!<!!!`*

##### Why the name?

Bit should be easy to understand, given that each operation happens on a single bit, as for bang--well it's both an alternate name for the `!` symbol, and a less rude synonym for one of the words in BrainFuck.
