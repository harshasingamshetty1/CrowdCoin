import React, { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Button, Icon } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "./components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";

function CampaignIndex({ campaigns, campaignCauses }) {
  const router = useRouter();
  // const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isConnectedToMumbai, setIsConnectedToMumbai] = useState(false);

  // // Check for MetaMask installation and network connection
  // useEffect(() => {
  //   if (typeof window.ethereum !== "undefined") {
  //     setIsMetamaskInstalled(true);
  //   }
  // }, []);

  // Function to handle creating a new campaign
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
  const handleCreateCampaign = async () => {
    if (await handleMetamask()) router.push("/campaigns/new");
  };

  const items = campaigns.map((campaignAddress, index) => {
    const handleOnClick = async () => {
      if (await handleMetamask()) router.push(`/campaigns/${campaignAddress}`);
    };
    return {
      header: `${campaignCauses[index]}`,
      description: (
        <button onClick={handleOnClick}>
          <a>{`View campaign (${campaignAddress})`}</a>
        </button>
      ),
      fluid: true,
    };
  });

  return (
    <Layout>
      <>
        <h1 className="">Campaigns</h1>
        <Button
          icon
          floated="right"
          color="blue"
          size="large"
          onClick={handleCreateCampaign}
          style={{ marginBottom: "20px" }}
          // disabled={!isMetamaskInstalled || !isConnectedToMumbai}
        >
          <Icon name="add circle" />
          {"   "}Create New Campaign
        </Button>
      </>
      <Card.Group items={items} centered />
    </Layout>
  );
}

CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  let campaignCauses = [];

  if (campaigns.length > 0) {
    // Use Promise.all to await all async calls
    const causesPromises = campaigns.map(async (campaignAddress) => {
      const cause = await factory.methods.campaignCause(campaignAddress).call();
      console.log("the cause in loop =", cause);
      return cause;
    });

    campaignCauses = await Promise.all(causesPromises);
  }

  console.log("cause =", campaignCauses);
  return { campaigns, campaignCauses };
};

export default CampaignIndex;
