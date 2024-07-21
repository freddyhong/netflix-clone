import styled from "styled-components";
import { IGetDetailMovieResult, getVideoDetail } from "../api";
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

export default function Movie({ videoId }: { videoId: string }) {
  const navigate = useNavigate();

  const { data } = useQuery<IGetDetailMovieResult>(
    ["moviedetail", "detail"],
    () => getVideoDetail("movie", videoId)
  );

  const onClickTrailers = (videoId: string) => {
    navigate(`/trailers/${videoId}`, {
      state: { category: "movie", title: data?.title },
    });
  };

  return (
    <DetailDiv>
      {data?.release_date ? <p>· Release date : {data?.release_date}</p> : null}
      {data?.genres[0] ? (
        <p>· Genres : {data?.genres?.map((props) => props.name + " / ")}etc.</p>
      ) : null}
      {data?.vote_average?.toFixed(1) ? (
        <p>· Rating : {data?.vote_average?.toFixed(1)} / 10</p>
      ) : null}
      {data?.runtime ? <p>· Runtime : {data?.runtime}m</p> : null}
    </DetailDiv>
  );
}
