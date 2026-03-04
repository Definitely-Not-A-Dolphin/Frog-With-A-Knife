while :
do
  cd ../Frog-With-A-Knife-Token;
  echo "Pulling secrets";
  git pull;

  cd ../Frog-With-A-Knife;
  echo "Copying secrets";
  cp ../Frog-With-A-Knife-Token/prod.env .env;

  echo "Pulling code";
  git pull;

  echo "deno install";
  deno install;

  echo "docker compose up --build";
  docker compose -up;

  echo "getting eepy";
  sleep 1h;
done
