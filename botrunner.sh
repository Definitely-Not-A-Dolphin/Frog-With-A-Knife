while :
do
  cd ../Frog-With-A-Knife-Token;
  echo "Pulling secrets";
  git pull;

  cd ../Frog-With-A-Knife;
  echo "Copying secrets";
  deno run copy-prod;

  echo "Pulling code";
  git pull;

  echo "deno install";
  deno install;

  echo "docker compose up --build";
  docker compose up --build;

  echo "getting eepy";
  sleep 1h;

  echo "The container must be stopped!";
  docker stop frog-with-a-knife-frog-1;
done
