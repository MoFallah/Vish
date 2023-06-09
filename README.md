=========System requirements=========

node 18.16.x
npm 9.5.1
Angulr/cli


=========Installation=========
To install node and npm on Ubuntu:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
sudo apt-get install -y nodejs 
You can find above command in "https://github.com/nodesource/distributions"

After installing node, please make sure you have it installed by checking the versions:
node --version
npm --version


To install angular/cli on Ubunto (on which node is installed):
npm install @angular/cli --location=global

After installing the cli, please make sure you have it installed by checking its version:
ng v


=========Running the project=========
npm run start
then navigate to http://localhost:4200/

Test:
npm run test
