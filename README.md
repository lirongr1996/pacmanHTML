[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7759218&assignment_repo_type=AssignmentRepo)


# Pacman
#### **Shir Indaporker 206260218 |  Liron Groer 316551142  |  Anna Kolkovsky 321892408**


 https://web-development-environments-2022.github.io/assignment2-316551142_206260218_321892408/
 
 
 ## Our Pacman Site:

<img width="800" alt="image" src="https://user-images.githubusercontent.com/81624047/169507927-b200e4f7-4b6b-438e-8b9c-a5645bb16996.png">

**Welcome:** The home page of the site contains buttons for registration and login

**Register:** User registration page that requires the following details- username, password, email, full name and birthday.The details verification is done by jquery.

**Login:** A login page where you verify the username against the password.

**Defintion:** A page that allows the user to set different settings for the game, such as the number of monsters during game time, etc.

## The Game:

<img width="800" alt="image" src="https://user-images.githubusercontent.com/81624047/169511403-7ff3ec18-6169-42dd-b044-90b28d36fba4.png">

Throughout the game the settings set by the user are displayed as well as the username, elapsed time, score, and life.
The Pacman starts the game with 5 lives.

## The game ended for three reasons:
1. The set time is up.
2. When Pacman has no lives.
3. When the Pacman ate all the food.

### Rules of the Game:
1. The pacman moves in the game according to the keyboard buttons defined so on pressing a key in a certain direction cause the pacman to move in the same direction  until he receives another press / reaches the wall.
2. There are 3 types of food so each type entitles the Pacman to a different score.
3. The game contains ghosts that chase the Pacman so that when they catch him, the Pacman loses score and life, and is thrown into a new position in the game.
4. Cherry is a "moving score" that moves on the screen randomly, earning Pacman 50 points.

### Additional functionality:
1. There are 2 medicine that if the pacman eats them he gets a different benefit:
   Red drug - entitles the Pacman to life.
   Green medicine - prevents the monsters from killing Pacman for a limited time of 5 seconds, The monsters change color to blue and a song plays in the background.

2. Visual effects - attached to the caption indicating loss and victory.

3. A special monster - with one eye and alternating colors, which reduce Pacman 2 lives and 20 points when he is captured.

4. SlowMotion effect - the ghosts will move slowly and the Pacman will continue to move as usual.


<table>
  <tr>
    <td  align="center" valign="middle">Ghost</td>
     <td  align="center" valign="middle">Special ghost</td>
     <td align="center" valign="middle">Cherry</td>
       <td align="center" valign="middle">Green medicine-</td>
     <td align="center" valign="middle">Red medicine</td>
     <td align="center" valign="middle">SlowMotion</td>
   
  </tr>
  <tr>
 <td><img width="56"  alt="image" src="https://user-images.githubusercontent.com/81624047/169517033-c4b34c4c-320c-4e4c-91a2-d22d4f69f41b.png">
</td>
   <td  align="center" valign="middle">
 <img width="56" style="vertical-align:middle" alt="image" src="https://user-images.githubusercontent.com/81624047/169517294-d47049ed-71f5-473e-8261-f14969ecccd7.png">
</td>
<td  align="center" valign="middle"><img width="56"  alt="image" src="https://user-images.githubusercontent.com/81624047/169517091-b302150d-a60c-406b-87fc-e6785fab0b17.png">
</td> 
<td  align="center" valign="middle">
 <img width="56"  alt="image" src="https://user-images.githubusercontent.com/81624047/169517227-a1a48aed-22b3-4961-aaeb-6770c35a9bea.png">
</td> 
<td  align="center" valign="middle">
 <img width="56" alt="image" src="https://user-images.githubusercontent.com/81624047/169517256-2740210f-1503-41ac-a987-1495144412c8.png">
</td> 

<td  align="center" valign="middle">
 <img width="56" alt="image" src="https://user-images.githubusercontent.com/81624047/169517338-f36c3c4e-5d90-49e6-9e67-fb0737a6c398.png">
</td>
  </tr>
 </table>




