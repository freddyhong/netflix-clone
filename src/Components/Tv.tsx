import styled from "styled-components";
import { IGetDetailTvResult, getVideoDetail } from "../api";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";

const DetailDiv = styled.div`
  padding: 10px 30px;
  width: 95%;

  font-size: 18px;
  font-weight: 500;
  min-height: 100px;
  p {
    color: #dff7ff;
  }
`;

export default function Tv({ videoId }: { videoId: string }) {
  const navigate = useNavigate();

  const { data: detailTv } = useQuery<IGetDetailTvResult>(
    ["tvdetail", "detail"],
    () => getVideoDetail("tv", videoId)
  );

  const onClickTrailers = (videoId: string) => {
    navigate(`/trailers/${videoId}`, {
      state: { category: "tv", title: detailTv?.name },
    });
  };

  return (
    <DetailDiv>
      {detailTv?.production_countries[0]?.name ? (
        <p>· Country : {detailTv?.production_countries[0]?.name}</p>
      ) : null}
      {detailTv?.genres[0] ? (
        <p>
          · Genres : {detailTv?.genres?.map((props) => props.name + " / ")}etc.
        </p>
      ) : null}
      {detailTv?.vote_average?.toFixed(1) ? (
        <p>· Rating : {detailTv?.vote_average?.toFixed(1)} / 10</p>
      ) : null}
      {detailTv?.spoken_languages[0]?.english_name ? (
        <p>· Language : {detailTv?.spoken_languages[0]?.english_name}</p>
      ) : null}
      {detailTv?.number_of_seasons ? (
        <p>· Number of seasons : {detailTv?.number_of_seasons}</p>
      ) : null}
      {detailTv?.number_of_episodes ? (
        <p>· Number of episodes : {detailTv?.number_of_episodes}</p>
      ) : null}
    </DetailDiv>
  );
}
