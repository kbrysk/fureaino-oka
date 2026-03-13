import { getPrefectureIds } from "../../lib/utils/city-loader";
import { PREFECTURE_ID_TO_NAME } from "../../lib/prefecture-ids";
import JikkaDiagnosisClient from "./JikkaDiagnosisClient";

export default function JikkaDiagnosisPage() {
  const prefIds = getPrefectureIds();
  const prefectures = prefIds.map((id) => ({
    id,
    name: PREFECTURE_ID_TO_NAME[id] ?? id,
  }));
  return <JikkaDiagnosisClient prefectures={prefectures} />;
}
