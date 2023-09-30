import React, { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Button, Icon } from "semantic-ui-react";
import factory from "../ethereum/factory";
import Layout from "./components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
function CampaignIndex({ campaigns, campaignCauses }) {
  const router = useRouter();
  console.log("campaigns", campaigns);

  const items = campaigns.map((campaignAddress, index) => {
    console.log(campaignAddress);
    return {
      header: `${campaignCauses[index]}`,
      // color: "",
      description: (
        <Link href={`/campaigns/${campaignAddress}`}>
          <a>{`View campaign  (${campaignAddress})`}</a>
        </Link>
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
          onClick={() => router.push("/campaigns/new")}
          style={{ marginBottom: "20px" }}
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
  const campaignCauses = [];

  if (campaigns.length > 0) {
    // Use Promise.all to await all async calls
    await Promise.all(
      campaigns.map(async (campaignAddress) => {
        const cause = await factory.methods
          .campaignCause(campaignAddress)
          .call();
        console.log("the cause in loop = ", cause);
        campaignCauses.push(cause);
      })
    );
  }

  console.log("cause =", campaignCauses);
  return { campaigns, campaignCauses };
};

export default CampaignIndex;
