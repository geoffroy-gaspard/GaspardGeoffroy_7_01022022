Projet 7 du parcours développeur web d'Openclassrooms

Cloner le projet à partir de github.
Installer les dépendances du front-end et du back-end avec npm install.
Node.js (v16.14) MySQL Server et MySQL Workbench (v8.0.28 x64)
Créer un server avec MySQL Server
Ouvrir le model de database dans le fichier backend avec MySQL workbench puis utiliser l'option forward engeneer dans l'onglet database afin de créer une base de donnée
Dans le backend/config, mettre à jour le fichier config.js avec les informations de connexion à votre server MySQL.
Créer un fichier .env dans le dossier backend contenant la key de token de votre choix pour DB_TOKEN (DB_TOKEN="clef de votre choix").
Dans le dossier backend créer un dossier uploads
Toujours dans le dossier backend ouvrir un terminal et executer " sequelize db:migrate " (il se peut qu'une ancienne version de node.js ne reconnaisse pas l'appel de commande sequelize, mettre à jour node.js devrait régler le problème)
Enfin lancer le front-end avec npm run serve et le back-end avec nodemon serve (il se peut qu'une ancienne version de node.js ne reconnaisse pas l'appel de commande nodemon, mettre à jour node.js devrait régler le problème)
Enjoy !