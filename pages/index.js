import React, { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Button, Icon } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "./components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
function CampaignIndex({ campaigns }) {
  const router = useRouter();
  console.log("campaigns", campaigns);

  const items = campaigns.map((campaignAddress) => {
    console.log(campaignAddress);
    return {
      header: campaignAddress,
      description: (
        <Link href={`/campaigns/${campaignAddress}`}>
          <a>View campaign</a>
        </Link>
      ),
      fluid: true,
    };
  });

  return (
    <div className="h-[100vh] bg-gradient-to-br from-gray-400 to-gray-800 ">
      <Layout>
        <>
          <h1 className="">Campaigns</h1>
          <Button
            icon
            floated="right"
            color="teal"
            size="large"
            onClick={() => router.push("/campaigns/new")}
            style={{ marginBottom: "20px" }}
          >
            <Icon name="add circle" />
            {"   "}Create New Campaign
          </Button>
        </>
        <Card.Group items={items} centered />
      </Layout>
    </div>
  );
}

//uses server side rendering to call the campaign contracts (so good for slow devices)
CampaignIndex.getInitialProps = async () => {
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns };
};

export default CampaignIndex;
