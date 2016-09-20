# BitBang

*I like BrainFuck, but why can't it be 8 times harder?*

BitBang is an esoteric programming language inspired by BrainFuck.  It however has one fewer character/instruction and is even harder to write, yay!

All symbols operate almost identically, except that `+` and `-` are replaced with `!`, and instead of operating on one byte of memory at a time, BitBang operates an a single bit.  As such, `!` inverts the current memory address.

## Turing Completeness

*Hey look, a deeper tar pit!*

I have chosen to prove turing completeness by implementation of another turing complete language, specifically--and for obvious reasons--BrainFuck!

The crux of this proof rests in implementing each individual instruction of BrainFuck (which acts on 1 byte) with a combination of 1 bit instructions.  16 bits are used per BrainFuck byte, half representing the corresponding BrainFuck value (big endian), and half serving as helper bits.

### >

This one is pretty straightforward, we skip over both the BrainFuck value and the helpers bits:

```brainfuck
>>>>>>>>>>>>>>>
```

### <

Pretty sure you can guess this one too:

```brainfuck
<<<<<<<<<<<<<<<<
```

### .

Not much harder here:

```brainfuck
.>.>.>.>.>.>.>.>>>>>>>>
```

### ,

I'm guessing you can solve this one...

```brainfuck
,>,>,>,>,>,>,>,>>>>>>>>>
```

### +

Okay a tough one!  First we're going to establish an if/else structure, that utilizes our helper bit, which is always exactly eight bits to the right.

```brainfuck
// Force to 0:
[!]

// Force to 1:
[!]!

// Execute exactly once if 1
// Set address bit's corresponding helper bit to 0
>>>>>>>>[!]<<<<<<<<
// if address bit is 1
[
  // set the corresponding helper bit to 1
  >>>>>>>>[!]!<<<<<<<<
  /*
    any code with equal left and right shifts
    that does not affect the address or helper bit
  */
  // zero out address bit to end the loop
  !
]
// if the helper is 1
>>>>>>>>[
  // set address bit to 1 and zero out the helper bit
  <<<<<<<<[!]!>>>>>>>>!
]
// return to address bit
<<<<<<<<

Execute exactly once if 0
!>>>>>>>>[!]<<<<<<<<[>>>>>>>>[!]!<
  /*
    any code with equal left and right shifts
    that does not affect the address or helper bit
  */
!] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
```

Now for our increment.  We flip the current bit, and if it's zero we need to carry and continue--at least until we run out of available bits (8).  Not how in the "body" of each "if" statement, we always return to the address where the statement started at the end.

```brainfuck
// increment
!
// if 0 {
!>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
  // carry
  <!
  // if 0 {
  !>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
    // carry
    <!
    // if 0 {
    !>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
      // carry
      <!
      // if 0 {
      !>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
        // carry
        <!
        // if 0 {
        !>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
          // carry
          <!
          // if 0 {
          !>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
            // carry
            <!
            // if 0 {
            !>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
              // carry
              <!
              // reached our maximum bits
              // move our address to counter our carry motion
              >
            // }
            !] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
            // move our address to counter our carry motion
            >
          // }
          !] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
          // move our address to counter our carry motion
          >
        // }
        !] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
        // move our address to counter our carry motion
        >
      // }
      !] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
      // move our address to counter our carry motion
      >
    // }
    !] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
    // move our address to counter our carry motion
    >
  // }
  !] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
  // move our address to counter our carry motion
  >
// }
!] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<!
```

### -

Well, this one isn't too far away from the previous.  The only fundamental difference is that we're going to borrow instead of carry.  When the result of the `!` is a 1, it means we need to borrow.

```brainfuck
!
>>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
  <!
  >>>>>>>>[!]<<<<<<<< [>>>>>>>>[!]!<
    /* and so on */
  !] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<
  >
!] >>>>>>>>[<<<<<<<<[!]!>>>>>>>>!]<<<<<<<
```

## FAQ

*It's as easy as `>!>!>>!>!`*

##### Why the name?

Bit should be easy to understand, given that each operation happens on a single bit, as for bang--well it's both an alternate name for the `!` symbol, and a less rude synonym for one of the words in BrainFuck.
