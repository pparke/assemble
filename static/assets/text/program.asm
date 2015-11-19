start:
mov a, 2			; Move immediate value 2 into a
mov b, 1			; move immediate value 1 into b
mov c, 10	    ; move immediate value 10 into c
mov d, b		  ; move value in b to d
loop:
mul d		      ; multiply d by a
push a        ; push the result on the stack
inc b				  ; Increment b (multiplier)
mov d, b      ; Move the incremented value into d
dec c				  ; Decrement c (counter)
jz start			; go back to start if we've done this 10 times
jmp loop		  ; Jump to location 12 (mul d)
