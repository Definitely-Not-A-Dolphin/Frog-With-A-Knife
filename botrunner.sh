while :
do
  cd ../Frog-With-A-Knife-Token;
  echo "git pull secrets";
  git pull;

  cd ../Frog-With-A-Knife;
  echo "Copying secrets";
  cp ../Frog-With-A-Knife-Token/.env.prod .env;

  echo "git pull code";
  git pull;

  echo "deno i --jsr; deno i --npm;";
  deno install;

  echo "deno run prod"
  deno run prod

  echo "getting eepy";
  sleep 1h;
done
