import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  getMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetMoviesResult,
} from "../api";
import { useState } from "react";
import { makeImagePath } from "../utils";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";
import Movie from "../Components/Movie";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const ColumWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const BannerDiv = styled(motion.div)`
  position: absolute;
  padding: 30px;
  border-radius: 30px;
  width: auto;
  max-width: 600px;
  min-width: 600px;
  min-height: 200px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-direction: column;
  &:hover h1 {
    color: #a9cdff;
  }
`;

const BannerTitle = styled.h1`
  font-size: 40px;
  color: #d6d6d6;
  font-weight: 600;
  transition: color 0.3s ease-in;
`;
const BannerInfo = styled.h2`
  color: #d6d6d6;
  font-size: 17px;
`;

const MoreInfo = styled(motion.div)`
  cursor: pointer;
  color: white;
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  font-size: 20px;
  font-weight: 300;
  &:hover {
    color: #ffbbbb;
    text-decoration: underline;
  }
`;

const SliderMain = styled.div`
  margin-bottom: 300px;
  position: relative;
`;
const SliderLast = styled.div`
  position: relative;
  margin-bottom: 100px;
`;

const SliderWrap = styled.div`
  position: relative;
`;

const SliderTitle = styled.h1`
  font-size: 30px;
  color: white;
  padding: 0px 40px;
`;

const Slider = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  position: absolute;
  width: 100%;
  padding: 30px 50px;
`;

const SliderBtnLeft = styled.div`
  cursor: pointer;
  position: absolute;
  left: 10px;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
  margin-right: 30px;
  &:hover {
    color: #ffabab;
    font-size: 23px;
  }
`;
const SliderBtnRight = styled.div`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: #ffffff;
  font-weight: bold;
  font-size: 20px;
  transition: 0.6s ease;
  user-select: none;
  border-radius: 3px 0 0 3px;
  &:hover {
    color: #ffabab;
    font-size: 25px;
  }
`;
const SliderContent = styled(motion.div)<{ bgphoto: string }>`
  background-color: #444444;
  display: flex;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  border-radius: 5px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  &:hover div {
    color: #c5daff;
    font-size: 21px;
  }
  cursor: pointer;
`;

const MovieTitle = styled.div`
  background-color: #767676c3;
  width: 100%;
  height: 50px;
  align-self: self-end;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #ffffff;
  font-size: 20px;
  transition: all 0.5s ease-in-out;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Xbtn = styled.div`
  cursor: pointer;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: tomato;
  color: black;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  margin: 7px;
  position: fixed;
  display: flex;
  &:hover {
    background-color: red;
  }
`;

const BigMovie = styled(motion.div)`
  position: fixed;
  top: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 40vw;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  display: flex;
`;

const PosterCover = styled.div`
  position: absolute;
  top: 33px;
  left: 30px;
  width: 210px;
  height: 300px;
  background-size: cover;
  background-position: center center;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  /* padding: 25px; */
  font-size: 30px;
  align-self: flex-end;
  padding: 10px 20px;
  white-space: nowrap;
  /* position: relative;
  top: -70px; */
`;

const BigOverview = styled.p`
  color: #dff7ff;

  padding: 5px 25px;
  padding-bottom: 20px;
  font-size: 19px;
  /* position: relative;
  top: -100px; */
  width: 95%;
  color: ${(props) => props.theme.white.lighter};
`;

const SliderVariants = {
  hidden: (moveback1: boolean) => ({
    x: moveback1 ? -window.outerWidth - 5 : window.outerWidth + 5,
  }),
  visible: {
    x: 0,
  },
  exit: (moveback1: boolean) => ({
    x: moveback1 ? window.outerWidth + 5 : -window.outerWidth - 5,
  }),
};

const ContentVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      delay: 0.2,
      duaration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

function Home() {
  const navigate = useNavigate();
  const FindMovie: PathMatch<string> | null = useMatch(
    "/movies/:category/:movieId"
  );

  const { data: nowPlaying, isLoading: nowPlayingLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const { data: topRated, isLoading: topRatedLoading } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], getTopRatedMovies);
  const { data: upComing, isLoading: upComingLoading } =
    useQuery<IGetMoviesResult>(["movies", "upComing"], getUpcomingMovies);
  const onBoxClicked = (movieId: number, category: string) => {
    navigate(`/movies/${category}/${movieId}`);
  };
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [moveback1, setmoveBack1] = useState(false);
  const [moveback2, setmoveBack2] = useState(false);
  const [moveback3, setmoveBack3] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onOverlayClick = () => navigate("/");
  const back1 = () => {
    setmoveBack1(true);
    if (nowPlaying) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / 5) - 1;
      setIndex1((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const next1 = () => {
    setmoveBack1(false);
    if (nowPlaying) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalMovies / 5) - 1;
      setIndex1((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const back2 = () => {
    setmoveBack2(true);
    if (topRated) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / 5) - 1;
      setIndex2((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const next2 = () => {
    setmoveBack2(false);
    if (topRated) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = topRated.results.length - 1;
      const maxIndex = Math.floor(totalMovies / 5) - 1;
      setIndex2((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const back3 = () => {
    setmoveBack3(true);
    if (upComing) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upComing.results.length - 1;
      const maxIndex = Math.floor(totalMovies / 5) - 1;
      setIndex3((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const next3 = () => {
    setmoveBack3(false);
    if (upComing) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = upComing.results.length - 1;
      const maxIndex = Math.floor(totalMovies / 5) - 1;
      setIndex3((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const clickedMovie =
    FindMovie?.params.movieId &&
    (nowPlaying?.results.find(
      (movie) => movie.id === +FindMovie.params.movieId!
    ) ||
      topRated?.results.find(
        (movie) => movie.id === +FindMovie.params.movieId!
      ) ||
      upComing?.results.find(
        (movie) => movie.id === +FindMovie.params.movieId!
      ));
  //console.log(nowPlaying?.results);
  return (
    <Wrapper>
      {nowPlayingLoading && topRatedLoading && upComingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <ColumWrapper>
          <Banner
            bgphoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <BannerDiv
              onClick={() =>
                onBoxClicked(Number(nowPlaying?.results[0].id), "nowplaying")
              }
              layoutId={String(nowPlaying?.results[0].id) + "nowplaying"}
            >
              <BannerTitle>{nowPlaying?.results[0].title}</BannerTitle>
              <BannerInfo>{nowPlaying?.results[0].overview}</BannerInfo>
              <MoreInfo
                onClick={() =>
                  onBoxClicked(Number(nowPlaying?.results[0].id), "nowplaying")
                }
              >
                More Info
              </MoreInfo>
            </BannerDiv>
          </Banner>
          <SliderMain>
            <SliderTitle>Now Playing</SliderTitle>
            <SliderWrap>
              <AnimatePresence
                initial={false}
                onExitComplete={toggleLeaving}
                custom={moveback1}
              >
                <Slider
                  variants={SliderVariants}
                  custom={moveback1}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index1}
                >
                  <SliderBtnLeft onClick={back1}>&#10094;</SliderBtnLeft>
                  {nowPlaying?.results
                    .slice(1)
                    .slice(5 * index1, 5 * index1 + 5)
                    .map((movie) => (
                      <SliderContent
                        layoutId={movie.id + "nowplaying"}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={ContentVariants}
                        onClick={() => onBoxClicked(movie.id, "nowplaying")}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <MovieTitle>{movie.title}</MovieTitle>
                      </SliderContent>
                    ))}
                  <SliderBtnRight onClick={next1}>&#10095;</SliderBtnRight>
                </Slider>
              </AnimatePresence>
            </SliderWrap>
          </SliderMain>
          <SliderMain>
            <SliderTitle>Popular</SliderTitle>
            <SliderWrap>
              <AnimatePresence
                initial={false}
                onExitComplete={toggleLeaving}
                custom={moveback2}
              >
                <Slider
                  variants={SliderVariants}
                  custom={moveback2}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index2}
                >
                  <SliderBtnLeft onClick={back2}>&#10094;</SliderBtnLeft>
                  {topRated?.results
                    .slice(1)
                    .slice(5 * index2, 5 * index2 + 5)
                    .map((movie) => (
                      <SliderContent
                        layoutId={movie.id + "topRated"}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={ContentVariants}
                        onClick={() => onBoxClicked(movie.id, "topRated")}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <MovieTitle>{movie.title}</MovieTitle>
                      </SliderContent>
                    ))}
                  <SliderBtnRight onClick={next2}>&#10095;</SliderBtnRight>
                </Slider>
              </AnimatePresence>
            </SliderWrap>
          </SliderMain>
          <SliderLast>
            <SliderTitle>Coming Soon</SliderTitle>
            <SliderWrap>
              <AnimatePresence
                initial={false}
                onExitComplete={toggleLeaving}
                custom={moveback2}
              >
                <Slider
                  variants={SliderVariants}
                  custom={moveback2}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index3}
                >
                  <SliderBtnLeft onClick={back3}>&#10094;</SliderBtnLeft>
                  {upComing?.results
                    .slice(1)
                    .slice(5 * index3, 5 * index3 + 5)
                    .map((movie) => (
                      <SliderContent
                        layoutId={movie.id + "upComing"}
                        key={movie.id}
                        whileHover="hover"
                        initial="normal"
                        variants={ContentVariants}
                        onClick={() => onBoxClicked(movie.id, "upComing")}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      >
                        <MovieTitle>{movie.title}</MovieTitle>
                      </SliderContent>
                    ))}
                  <SliderBtnRight onClick={next3}>&#10095;</SliderBtnRight>
                </Slider>
              </AnimatePresence>
            </SliderWrap>
          </SliderLast>
          <AnimatePresence>
            {FindMovie ? (
              <div>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={
                    FindMovie.params.movieId +
                    String(FindMovie?.params.category)
                  }
                >
                  <Xbtn onClick={onOverlayClick}>
                    <svg
                      fill="none"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </Xbtn>
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        {" "}
                        <BigTitle>{clickedMovie.title}</BigTitle>
                      </BigCover>

                      <Movie videoId={String(clickedMovie.id)} />
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                      <PosterCover
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedMovie.poster_path,
                            "w500"
                          )})`,
                        }}
                      ></PosterCover>
                    </>
                  )}
                </BigMovie>
              </div>
            ) : null}
          </AnimatePresence>
        </ColumWrapper>
      )}
    </Wrapper>
  );
}
export default Home;
