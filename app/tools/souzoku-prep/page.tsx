import { getPrefectureIds } from "../../lib/utils/city-loader";
import { PREFECTURE_ID_TO_NAME } from "../../lib/prefecture-ids";
import SouzokuPrepClient from "./SouzokuPrepClient";

export default function SouzokuPrepPage() {
  const prefIds = getPrefectureIds();
  const prefectures = prefIds.map((id) => ({
    id,
    name: PREFECTURE_ID_TO_NAME[id] ?? id,
  }));
  return <SouzokuPrepClient prefectures={prefectures} />;
}
