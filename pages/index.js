import Head from "next/head";
import { table, minifyItems } from "../utils/Airtable";
import { useQRCode } from 'next-qrcode';
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/router';
import { Variants, motion, useAnimate } from "framer-motion";
import badWords from 'bad-words';


const isNicknameClean = (nickname) => {
  const filter = new badWords();
  return !filter.isProfane(nickname);
};




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
  const [records, setRecords] = useState(initialItems);
  const [scope, animate] = useAnimate();
  const [isOpen, setIsOpen] = useState(true);
  const { SVG } = useQRCode();
  const [initialLength, setInitialLength] = useState(initialItems.length)

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch('/api/items')
        .then(response => response.json())
        .then(data => setRecords(data))
        .catch(error => console.log(error));
    }, 5000);
  
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    if (records.length !== initialLength) {
      animate(scope.current, {  opacity: [1, 0, 1] }, { duration: 0.5, repeat: 3 })
      console.log('increased!')
      setInitialLength(records.length)
      setIsOpen(false)

      // set isOpen to true after 0.5 seconds
      setTimeout(() => {
        setIsOpen(true)
      }, 900)
    }
  }, [records, initialLength]);
    

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().substr(-2);
    const formattedDate = `${day < 10 ? '0' + day : day} - ${month < 10 ? '0' + month : month} - ${year}`;
    return formattedDate;
  }

  const filteredItems = records.filter((item) => isNicknameClean(item.fields.Nickname));

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
        <img ref={scope} src="high_scores.svg" className="mb-36 mt-24"/>
        <div className="flex justify-between items-center text-8xl">
          <div>-</div>
        <div className="uppercase text-center text-8xl">play to win</div>
        <div>-</div>
        </div>
        </div>
        <motion.div initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: {
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05
            }
          },
          closed: {
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05
            }
          }
        }}
        className="my-2 py-2 min-h-[67vh]">

          {filteredItems.sort((a, b) => b.fields.Result - a.fields.Result).slice(0, 10).map((item, i) => (
            <motion.div variants={itemVariants} key={i} className="grid grid-cols-[40%_35%_25%] items-center text-[5.5rem] px-8 py-3 mb-16 border-8 border-magenta">
              <div className="uppercase pt-3"><span className="mr-10">{i+1}.</span> {item.fields.Nickname}</div>
              <div className="justify-self-end pt-3">{formatDate(item.fields.Date)}</div>
              <div className="justify-self-end flex items-bottom"><div className="text-9xl pt-3">{item.fields.Result < 100 ? '0' + item.fields.Result : item.fields.Result}</div><img src="basketball.svg" className="w-[6vw] pl-6"/></div>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex justify-between">
            <div>
            <SVG
              text={'https://bapexadidas.com'}
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