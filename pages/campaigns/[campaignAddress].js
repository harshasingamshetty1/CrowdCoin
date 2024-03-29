import React from "react";
import Campaign from "../../ethereum/campaign";
import Layout from "../components/Layout";
import web3 from "../../ethereum/web3";
import ContributeForm from "../components/ContributeForm";
import { Card, Button } from "semantic-ui-react";
import { useRouter } from "next/router";

const CampaignShow = ({
  campaignCause,
  campaignAddress,
  minimumContribution,
  balance,
  requestCount,
  approversCount,
  manager,
}) => {
  const router = useRouter();
  const items = [
    {
      header: "Manager Address",
      meta: manager,
      description:
        "The manager created this campaign and can create requests to withdraw this money",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Minimum Contribution",
      meta: `${minimumContribution} wei`,
      description:
        "The minimum amount to contribute to this campaign in wei to become an approver",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Camapaign Balance",
      meta: `${balance} wei = ${web3.utils.fromWei(balance, "ether")} eth`,
      description: "How much money this campaign has left to spend",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Number of requests",
      meta: requestCount,
      description:
        "A request tries to withdraw money from the account. Requests must be approved by a minimum 50% of approvers",
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Number of Approvers",

      meta: approversCount,
      description:
        "The number of approvers that have already contributed to this campaign",
      style: { overflowWrap: "break-word" },
    },
  ];
  return (
    <Layout>
      <h1>Campaign Details</h1>
      <ContributeForm
        campaignAddress={campaignAddress}
        campaignCause={campaignCause}
      />
      <br />
      <Card.Group items={items}></Card.Group>
      <br />
      <Button
        onClick={() => router.push(`/campaigns/${campaignAddress}/requests`)}
        color="blue"
        // style={{ backgroundColor: "transparent", color: "rgb(0,100,255)" }}
        size="tiny"
        under
        secondary
      >
        Go to Requests
      </Button>
    </Layout>
  );
};

//uses server side rendering to call the campaign contracts (so good for slow devices)
CampaignShow.getInitialProps = async (props) => {
  const campaignDetails = Campaign(props.query.campaignAddress);
  const summary = await campaignDetails.methods.getSummary().call();

  return {
    campaignCause: summary[0],
    campaignAddress: props.query.campaignAddress,
    minimumContribution: summary[1],
    balance: summary[2],
    requestCount: summary[3],
    approversCount: summary[4],
    manager: summary[5],
  };
};

export default CampaignShow;
