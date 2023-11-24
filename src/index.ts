import { Command } from 'commander';
import { balance, login, logout } from './commands/account';
const program = new Command();
import * as os from 'os';
import { displayDepositAddress, displayDepositQr } from './commands/deposit';
import { connectVPN, disconnectVPN } from './commands/connection';
import { init } from './commands/init';

program.hook('preAction',()=>{
  if(os.userInfo().username!='root')
  {
    console.log('Admin/Superuser Privilages are required')
    process.exit(126)
  }
})

program
  .name('Octa.space Cli Client')
  .description('Tool to Interact with Octa.Space CUBE, order services, connect to VPN, etc')
  .version('0.0.1');

  program
  .command('init')
  .description('Quick command to install dependencies')
  .action(() => {
    init()
  });

  program
  .command('login')
  .argument('[API_KEY]', 'Get API Key from Cube Portal')
  .action((key) => {
    login(key)
  });

  program
  .command('logout')
  .description('Sign\'s Out from octacli')
  .action(() => {
    logout()
  });

  program
  .command('balance')
  .description('Returns current Balance')
  .action(() => {
    balance()
  });

  const deposit = program.command('deposit')
  .description('Display Deposit details');

  deposit.command("address")
  .description("Show Deposit Address")
  .action(()=>{
    displayDepositAddress()
  })

  deposit.command("qr")
  .description("Show QR Code")
  .action(()=>{
    displayDepositQr()
  })

const vpn = program.command('vpn')
.description('Commands related to VPN');

vpn.command('connect')
.description('Connect your system to VPN Node')
.argument('[id]', 'Specify Node ID')
.action((id)=>{
  connectVPN(id)
})

vpn.command('disconnect')
.description('Disconnect from Node')
.action(()=>{
  disconnectVPN()
})

program.parse();
