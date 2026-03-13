import { getPrefectureIds } from "../../lib/utils/city-loader";
import { PREFECTURE_ID_TO_NAME } from "../../lib/prefecture-ids";
import DigitalShameClient from "./DigitalShameClient";

export default function DigitalShamePage() {
  const prefIds = getPrefectureIds();
  const prefectures = prefIds.map((id) => ({
    id,
    name: PREFECTURE_ID_TO_NAME[id] ?? id,
  }));
  return <DigitalShameClient prefectures={prefectures} />;
}
