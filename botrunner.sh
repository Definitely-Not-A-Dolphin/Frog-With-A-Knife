while :
do
  cd ~/Documents/Projects/Frog-With-A-Knife-Token;
  echo "git pull secrets";
  git pull;

  cd ../;
  echo "Copying secrets";
  cp Frog-With-A-Knife-Token/.env.prod ../Frog-With-A-Knife/.env;

  cd Frog-With-A-Knife;
  echo "git pull code";
  git pull;

  echo "deno i --jsr; deno i --npm;";
  deno i --jsr;
  deno i --npm;

  echo "deno run prod"
  deno run prod

  echo "getting eepy";
  sleep 1h;
done
