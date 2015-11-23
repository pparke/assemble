start:
  mov a, 1			; Move immediate value 1 into a
  mov b, 4			; move immediate value 4 into b
  mov c, 0	    ; move immediate value 0 into c
  div b		      ; divide b by a
  mov d, a		  ; move value in a to d
loop:
  inc c         ; increment the counter
  mov a, c      ; move the count into a
  inc a         ; increment by 1
  add a, c      ; add the count to itself + 1, this is the divisor
  div b         ; divide 4 by it
  push c        ; save a copy of c
  and c, 01H    ; check if even or odd
  pop c         ; pop the value of c back out
  jz even       ; "
  sub d, a      ; subtract if odd
even:
  add d, a      ; add if even
  jmp loop		  ; repeat
