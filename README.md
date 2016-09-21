# BitBang

*I like BrainFuck, but why can't it be 8 times harder?*

BitBang is an esoteric programming language inspired by BrainFuck.  It however has two fewer character/instruction and is even harder to write, yay!

All symbols operate almost identically, except that `+`, `-`, and `>` are replaced with `!`. Instead of operating on one byte of memory at a time, BitBang operates an a single bit.  `!` inverts the value at current memory address, and advances the pointer address by one.

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

Okay a tough one!  First we're going to establish an if/else structure, that utilizes our inc/dec helper bit, which is always exactly ten bits to the right.

```brainfuck
// Flip the current bit, and return to its address
!<

// Force to 0:
[!<]

// Force to 1:
[!<]!<

// Execute exactly once if 1
// Set address bit's corresponding inc/dec helper bit to 0
!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<
// if address bit is 1
[
  // set the corresponding inc/dec helper bit to 1
  !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<<<
  /*
    any code with equal left and right shifts
    that does not affect the address or inc/dec helper bit
  */
  // zero out address bit to end the loop
  !<
]
// if the inc/dec helper is 1
!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![
  // set address bit to 1 and zero out the inc/dec helper bit
  <<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<
]
// return to address bit
<<<<<<<<<<

Execute exactly once if 0
!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<<[!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
  /*
    any code with equal left and right shifts
    that does not affect the address or inc/dec helper bit
  */
!<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
```

Now for our increment.  We flip the current bit, and if it's zero we need to carry and continue--at least until we run out of available bits (8).  Note how at the end of the "body" of each "if" statement, we always return to the address where the statement started.

```brainfuck
// increment the little end of our value
!<!!<!!<!!<!!<!!<!!<!!<
// if 0 {
!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
  // carry
  <!<
  // if 0 {
  !<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
    // carry
    <!<
    // if 0 {
    !<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
      // carry
      <!<
      // if 0 {
      !<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
        // carry
        <!<
        // if 0 {
        !<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
          // carry
          <!<
          // if 0 {
          !<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
            // carry
            <!<
            // if 0 {
            !<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
              // carry
              <!<
              // reached our maximum bits
              // move our address to counter our carry motion
              !<!
            // }
            !<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
            // move our address to counter our carry motion
            !<!
          // }
          !<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
          // move our address to counter our carry motion
          !<!
        // }
        !<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
        // move our address to counter our carry motion
        !<!
      // }
      !<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
      // move our address to counter our carry motion
      !<!
    // }
    !<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
    // move our address to counter our carry motion
    !<!
  // }
  !<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
  // move our address to counter our carry motion
  !<!
// }
!<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<!<
return to the big end of our value
<<<<<<<
```

### -

Well, this one isn't too far away from the previous.  The only fundamental difference is that we're going to borrow instead of carry.  When the result of the `!<` is a 1, it means we need to borrow.

```brainfuck
!<!!<!!<!!<!!<!!<!!<!!<
!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
  <!<
  !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]<<<<<<<<<< [!<!!<!!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<
    /* and so on */
  !<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<
  !<!
!<] !<!!<!!<!!<!!<!!<!!<!!<!!<!!<![<<<<<<<<<<[!<]!<!<!!<!!<!!<!!<!!<!!<!!<!!<!!<!!<]<<<<<<<
<<<<<<<
```

### []

Lastly, we have the "while" loop symbols, which are also fairly difficult.  We now use our while bit and while helper bit.  We set the while bit to 1 if any of the BrainFuck value bits are 1.  If that's one, we exexecute our code block.

```brainfuck
// set the while bit to 1 so we can enter the loop
!<!!<!!<!!<!!<!!<!!<!!<![!<]!<
[
  // set the while bit to 0 to prevent infinite looping
  [!<]
  // if the first BrainFuck value bit is 1 set the while loop to 1
  <[!<![!<]!<<]
  // if the second BrainFuck value bit is 1 set the while loop to 1
  <[!<!!<![!<]!<<<]
  // and so on
  <[!<!!<!!<![!<]!<<<<]
  <[!<!!<!!<!!<![!<]!<<<<<]
  <[!<!!<!!<!!<!!<![!<]!<<<<<<]
  <[!<!!<!!<!!<!!<!!<![!<]!<<<<<<<]
  <[!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<]
  <[!<!!<!!<!!<!!<!!<!!<!!<![!<]!<<<<<<<<<]
  // return to the while bit
  !<!!<!!<!!<!!<!!<!!<!!<!
  // if 1 {
  !<![!<]<[!<![!<]!<<
    /*
      contents of the while loop
    */
  // }
  !<]!<![<[!<]!<!<!!<]<
// if the while bit was 1 continue looping
]
// return the pointer to the big end of the BrainFuck value
<<<<<<<<
```

## FAQ

*It's as easy as `>!!>!!`*

##### Why the name?

Bit should be easy to understand, given that each operation happens on a single bit, as for bang--well it's both an alternate name for the `!` symbol, and a less rude synonym for one of the words in BrainFuck.
