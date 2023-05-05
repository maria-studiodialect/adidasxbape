import Head from "next/head";
import { table, minifyItems } from "../utils/Airtable";


export async function getServerSideProps(context) {
  try {
    const items = await table.select({}).firstPage();
    return {
      props: {
        initialItems: minifyItems(items),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        err: "Something went wrong 😕",
      },
    };
  }
}



export default function Home({initialItems}) {

  const sortedItems = initialItems.sort((a, b) => b.fields.Result - a.fields.Result);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().substr(-2);
    const formattedDate = `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    return formattedDate;
  }
  return (
    <div className="mx-20 my-24">
      <Head>
        <title>Adidas x BAPE</title>
      </Head>

      <main>
        <div className="w-5/6 mx-auto">
        <div className="flex justify-between items-center text-8xl">
          <div>-</div>
        <div className="uppercase text-center text-8xl my-4">play to win</div>
        <div>-</div>
        </div>
        <img src="shoot_hoops.svg" className="mt-16 mb-32 mx-10"/>
        </div>
        <img src="adixbape_divider.svg" className="mt-2 mb-14"/>
        <div className="my-2 py-2">
          {sortedItems.map((item, i) => (
            <div key={i} className="grid grid-cols-[40%_35%_25%] items-center text-4xl 2xl:text-[5.5rem] pb-20 mx-28">
              <div className="uppercase"><span className="mr-10">{i+1}.</span> {item.fields.Name}</div>
              <div className="justify-self-end">{formatDate(item.fields.Date)}</div>
              <div className="justify-self-end flex items-bottom text-6xl 2xl:text-9xl">{item.fields.Result < 100 ? '0' + item.fields.Result : item.fields.Result}<img src="basketball.svg" className="w-[6vw] pl-6"/></div>
            </div>
          ))}
        </div>
        <img src="adixbape_divider.svg" className="mb-2"/>
      </main>
    </div>
  );
}