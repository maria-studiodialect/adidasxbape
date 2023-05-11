import Head from "next/head";
import { table, minifyItems } from "../utils/Airtable";
import { useQRCode } from 'next-qrcode';



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
  const { SVG } = useQRCode();

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
    <div className="mx-32 my-36">
      <Head>
        <title>Adidas x BAPE</title>
      </Head>

      <main>
        <div className="mx-auto mb-24">
        <div className="flex justify-between items-center text-8xl">
          <div>-</div>
        <div className="uppercase text-center text-8xl">shoot hoops</div>
        <div>-</div>
        </div>
        <img src="high_scores.svg" className="mb-36 mt-24"/>
        <div className="flex justify-between items-center text-8xl">
          <div>-</div>
        <div className="uppercase text-center text-8xl">play to win</div>
        <div>-</div>
        </div>
        </div>
        <div className="my-2 py-2">
          {sortedItems.slice(0, 10).map((item, i) => (
            <div key={i} className="grid grid-cols-[40%_35%_25%] items-center text-4xl 2xl:text-[5.5rem] px-8 py-3 mb-16 border-8 border-magenta">
              <div className="uppercase pt-5"><span className="mr-10">{i+1}.</span> {item.fields.Name}</div>
              <div className="justify-self-end pt-5">{formatDate(item.fields.Date)}</div>
              <div className="justify-self-end flex items-bottom"><div className="text-6xl 2xl:text-9xl pt-5">{item.fields.Result < 100 ? '0' + item.fields.Result : item.fields.Result}</div><img src="basketball.svg" className="w-[6vw] pl-6"/></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-10">
            <div>
            <SVG
              text={'https://adidasxbape.com'}
              options={{
                margin: 0,
                width: 170,
                color: {
                  dark: '#EC0089',
                  light: '#000000',
                },
              }}
            />
            <div className="mt-4 text-5xl">SCAN QR TO GET ON THE BOARD</div>
            </div>
            <div className="flex items-center">
              <img src="adidas.svg"/>
              <div className="border-l-4 border-magenta h-full mx-12"></div>
              <img src="bape.svg"/>
            </div>
        </div>
      </main>
    </div>
  );
}