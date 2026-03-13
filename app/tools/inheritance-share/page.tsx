import { getPrefectureIds } from "../../lib/utils/city-loader";
import { PREFECTURE_ID_TO_NAME } from "../../lib/prefecture-ids";
import InheritanceShareClient from "./InheritanceShareClient";

export default function InheritanceSharePage() {
  const prefIds = getPrefectureIds();
  const prefectures = prefIds.map((id) => ({
    id,
    name: PREFECTURE_ID_TO_NAME[id] ?? id,
  }));
  return <InheritanceShareClient prefectures={prefectures} />;
}
