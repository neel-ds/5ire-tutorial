import NFTCard from "@/components/card";
import { CONTRACT_ADDRESS, abi } from "@/utils/contract";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
} from "wagmi";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";

const IMAGE =
  "https://images.unsplash.com/photo-1672135483622-c5e769736c8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80";

export default function Home() {
  const { address } = useAccount();
  const toast = useToast();
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: "safeMint",
    args: [address],
    onError: (error) => {
      console.log("Error", error);
    },
    onSuccess: (result) => {
      console.log("Success", result);
    },
  });

  const { data, write, error } = useContractWrite(config);
  const { isSuccess } = useWaitForTransaction({ hash: data?.hash });

  useEffect(() => {
    console.log("isSuccess", isSuccess);
    console.log("error", error);
    if (isSuccess) {
      toast({
        title: "NFT Minted",
        description: "Your first NFT has been minted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    if (error) {
      toast({
        title: "Error",
        description: "There was an error minting this token: " + error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isSuccess, error]);

  return (
    <>
      <main className="px-4 md:px-0 my-14 mx-auto max-w-[1080px]">
        <h1>Mint your NFT</h1>
        <NFTCard
          image={IMAGE}
          tag="Exclusive"
          title="Abstract Art"
          onClick={() => write?.()}
        />
      </main>
    </>
  );
}
