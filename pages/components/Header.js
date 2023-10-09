import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";

//Hosts the top level layout of our app
const Header = () => {
  const router = useRouter();
  const handleMetamask = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask extension to continue.");
      return false;
    }
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x13881") {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      }
    }
    return true;
  };
  return (
    <Menu style={{ marginTop: "1em", backgroundColor: "transparent" }}>
      <Menu.Item
        onClick={async () => {
          if (await handleMetamask()) router.push("/");
        }}
      >
        CrowdCoin
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          onClick={async () => {
            if (await handleMetamask()) router.push("/");
          }}
        >
          Campaigns
        </Menu.Item>
        <Menu.Item
          onClick={async () => {
            if (await handleMetamask()) router.push("/campaigns/new");
          }}
        >
          <Icon name="add circle" />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
