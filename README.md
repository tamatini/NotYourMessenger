# NotYourMessenger

Not Your Messenger est une application de message instantané utilisant
le service Facebook Messenger. L'application à été créer pour avoir un fenêtre indépendante du navigateur web
 afin de se répérer plus facilement lors des conversation.


## Installation

l'application nécéssite [NodeJS](https://nodejs.org/en/download/) et [Electron](https://electronjs.org/)

Installer NodeJS si nécéssaire.
Placez vous dans le dossier source et utiliser la commande:

```
npm install --save-dev electron
```

puis 

```
npm start
```

## Passer en mode Developpeur
Pour retirer/ajouter la fenêtre dev dans l'application ajouter/retirer:

```
messenger.webContents.openDevTools();
```

dans la partie "Fonctionnalités"

## Bug connues:

- pas d'appel audio/vidéo(en cour)
- ~~sauvegarde du thême~~
- ~~pouce bleu de mauvaise couleur~~
- ~~icones ce chevauche sur une certaine taille de fenêtre~~
- ~~fond des liens de la mauvaise couleur~~

## En cours:

- refactorisation du code et optimisation
- ~~barre de navigation customizer~~
- ~~sélection du dark mode ou normal~~
- choix de la police
- notification numéré
- ~~barre de tâche~~
- auto-updater
- ~~installeur différent~~
- ~~version MacOS~~ 
- ~~version Linux~~

le GNU et la contribution est en cours d'écriture. 

## Auteur

- TEAHUI Jeffrey

## Liens

[Facebook](https://www.facebook.com/tamatini.teahui) -  [Github](https://github.com/tamatini) - [LinkedIn](https://www.linkedin.com/in/teahuijey/)
