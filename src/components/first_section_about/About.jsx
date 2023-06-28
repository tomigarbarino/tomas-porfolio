import React, { useState, useEffect } from "react";
import axios from "axios";
import "./about.css";

const About = () => {
  const [displayWord, setDisplayWord] = useState("");
  const [quote, setQuote] = useState(null);
  const wordList = ["Front-end developer", "Web designer", "Pixel perfect"];

  const animateWord = async (word) => {
    for (let i = 0; i <= word.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setDisplayWord(word.slice(0, i));
          resolve();
        }, 100);
      });
    }
  };

  useEffect(() => {
    let index = 0;
    let isCancelled = false;

    const changeWord = async () => {
      while (!isCancelled) {
        await animateWord(wordList[index]);
        index = (index + 1) % wordList.length;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    };

    changeWord();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get("https://type.fit/api/quotes");
        const data = response.data;
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuote(`${data[randomIndex].text} - ${data[randomIndex].author}`);
      } catch (error) {
        console.error("Error al obtener la frase motivadora:", error);
        setQuote("No se pudo cargar la frase motivadora.");
      }
    };

    fetchQuote();
  }, []);


  return (
    <main className="px-5 max-w-[1560px] mx-auto min-h-screen pt-20 flex flex-wrap items-center justify-center">
      <div className="w-full sm:w-1/2 mx-auto text-center">
        <h1 className="font-semibold text-[32px] text-white mb-3">
          Tomas is a{" "}
          <span className="text-[#C778DD]">
            {displayWord}
          </span>
        </h1>
        <p className="text-[#ABB2BF] my-6">
          He crafts responsive websites where technologies meet creativity
        </p>
        <a
          href="mailto:tomasgarbarino.dev@gmail.com"
          className="duration-150 hover:bg-[#C778DD33] border border-[#C778DD] px-4 py-2 text-white"
        >
          <button>Contact me</button>
        </a>
      </div>
      <div className="w-full sm:w-1/2 mx-auto text-center">
        <figure>
          <img src={require("./imgs/man.png")} alt="Tomas Garbarino" />
        </figure>
        <div className="border flex items-center gap-2 border-[#ABB2BF] p-2 text-[#ABB2BF] justify-center">
          <div className="w-4 h-4 bg-[#C778DD]"></div>
          <div className="">
            Currently working on <span className="text-white">Hogarth WW {/*(Client:<span className="text-[#C778DD]">Apple</span>)*/}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div className="border border-[#C778DD] text-center p-4 rounded-md inline-block">
          <p className="text-white text-lg">{quote}</p>
        </div>
      </div>
    </main>
  );
};

export default About
