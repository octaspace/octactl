import { Command } from "commander";
import { balance, login, logout } from "./commands/account";
import { displayDepositAddress, displayDepositQr } from "./commands/deposit";
import { connectVPN, disconnectVPN } from "./commands/connection";
import { displayVPNNodes } from "./commands/list";

const program = new Command();

program.name("octactl");

program
  .command("login")
  .argument("API_KEY")
  .description("Log in to a system")
  .action((key) => {
    login(key);
  });

program
  .command("logout")
  .description("Log out from a system")
  .action(() => {
    logout();
  });

program
  .command("balance")
  .description("Returns current balance")
  .action(() => {
    balance();
  });

const list = program
  .command("list")
  .description("Display nodes providing specific service");

list
  .command("vpn")
  .description("Show VPN Nodes")
  .action(() => {
    displayVPNNodes();
  });

const deposit = program
  .command("deposit")
  .description("Display deposit details");

deposit
  .command("address")
  .description("Show deposit address")
  .action(() => {
    displayDepositAddress();
  });

deposit
  .command("qr")
  .description("Show deposit address QR code")
  .action(() => {
    displayDepositQr();
  });

const vpn = program.command("vpn").description("Commands related to VPN");

vpn
  .command("connect")
  .description("Establish VPN connection")
  .argument("NODE_ID", "Node ID")
  .action((id) => {
    connectVPN(id);
  });

vpn
  .command("disconnect")
  .description("Terminate VPN connection")
  .argument("NODE_ID", "Node ID")
  .action((node_id) => {
    disconnectVPN(node_id);
  });

program.parse();
