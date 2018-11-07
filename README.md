# Multiple Cursors Functions

A atom package that adds more functions for multiple cursors

## Demonstration

![Demonstration](https://media.giphy.com/media/g4IN2oQqUsgzpCRlPQ/giphy.gif)

## Functions

To illustrate how the functions work, selections are marked like `this`, and cursors are marked like this: **|** . a ⭆ b represents how a is transformed into b with the execution of the function.

#### Reverse selection

Reverses the current selections. For each cursor it also selects the surrounding word if the cursors doesn't have a selection.

- functionCall(`argumentThree`, `argumentTwo`, `argumentOne`)

  ⭆ functionCall(argumentOne **|** , argumentTwo **|** , argumentThree **|** )

- functionCall(`argumentThree`, argument **|** Two, arg **|** umentOne)

  ⭆ functionCall(argumentOne **|** , argumentTwo **|** , argumentThree **|** )

#### Insert Letters

Inserts letters on the current cursors

- function_call(arg\_ **|** , arg\_ **|** , arg\_ **|** )

  ⭆ function_call(arg_a **|** , arg_b **|** , arg_c **|** )

#### Insert Numbers Simple

Inserts numbers on the current cursors, starting at 0.

- function_call(arg\_ **|** , arg\_ **|** , arg\_ **|** )

  ⭆ function_call(arg_0 **|** , arg_1 **|** , arg_2 **|** )

#### Insert Numbers

Opens up a dialog, which lets you choose a starting value and an increment value to insert numbers on the current cursors.

- function_call(positive_number\_ **|** , positive_number\_ **|** , positive_number\_ **|** )

  ⭆ _The user inserts "1" in the dialog box_

  ⭆ function_call(positive_number_1 **|** , positive_number_2 **|** , positive_number_3 **|** )

- function_call(odd_number\_ **|** , odd_number\_ **|** , odd_number\_ **|** )

  ⭆ _The user inserts "1:2" in the dialog box_

  ⭆ function_call(odd_number_1 **|** , odd_number_3 **|** , odd_number_5 **|** )

#### Split Selections

For each selection, the function deselects the selection and inserts cursors on both sides.

- Selection is on `both sides`

  ⭆ Selection is on **|** both sides **|**

- `This` is also works with `multiple selections`

  ⭆ **|** This **|** is also works with **|** multiple selections **|**

#### Selections To Cursors

For each selection, the function deselects the selection and inserts cursor before and after every character in the selection. This function includes a cursor on the start and end of the selection.

- This is nice for making lists! [a`bcd`e]

  ⭆ This is nice for making lists! [a **|** b **|** c **|** d **|** e]

- Just add a comma after executing function! [a`bc`d], [1`2345`6]

  ⭆ Just add a comma after executing function! [a **|** b **|** c **|** d], [1 **|** 2 **|** 3 **|** 4 **|** 5 **|** 6]
