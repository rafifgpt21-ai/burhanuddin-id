export type PublicationCoverSource = {
  fingerprint: string;
  fileName: string;
  rightsNote: string;
};

const ownerApprovedRightsNote =
  "Owner-supplied book cover approved for display on publication cards on 24 July 2026.";

export const publicationCoverSources: readonly PublicationCoverSource[] = [
  {
    fingerprint: "55d80a234e2f9031f88fb86fab43f53b22ee4a87c26f38cc4539142229504475",
    fileName:
      "Civil Society & Demokrasi - Survey tentang Partisipasi Sosial-Politik Warga Jakarta.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "043b2c132f53f7e7a7084d9da2712d72054f041191a46cefe14e659797ee7d28",
    fileName:
      "Defisit Pelayanan Publik - Survei Persepsi Masyarakat terhadap Pelayanan Publik di DKI Jakarta.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "bd8536bf765a672e6ec6666499a767e64c511c8a1a53ef5b98584d29aa84081a",
    fileName: "Dilema PKS - Suara dan Syariah.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "8c5b06208f55f3268b3965c24364abe17f3492a13e41b351e8658f1eb772caa3",
    fileName:
      "Disinformation and Election Propaganda - Impact on Voter Perceptions and Behaviours in Indonesia's 2024 Presidential Election.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "896144badd5b73dcdeb52ddaeeb838b63846660e38ace0de027dfee9a09bfce0",
    fileName: "Kuasa Uang - Politik Uang dalam Pemilu Pasca-Orde Baru.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "6a7f7e7d62b44d8ebd71e37e9062ca3ad59179dfe535e83e11df02d2b495c8bf",
    fileName: "Mencari Akar Kultural Civil Society di Indonesia.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "3e99a3dc231eed4d3461db270c665d4385eefd1eff8978f6807fa9d0f320cd8c",
    fileName:
      "Perang Bintang 2014 - Konstelasi dan Prediksi Pemilu dan Pilpres.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "95e7f3d16b4eae1906ba686874c665af3279a997ef041f7288c161e32649159c",
    fileName:
      "Populisme Politik Identitas & Dinamika Elektoral - Mengurai Jalan Panjang Demokrasi Prosedural.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "6092abf4842071364320f8268767e590e426af01b5cb63b37eae44b7669a327f",
    fileName: "Syariat Islam - Pandangan Muslim Liberal.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "f66a2a4dec6e2b346781b6ad4870b7e057eea69a8ff8e2ad9a72f810734c6767",
    fileName:
      "The Indonesia National Survey Project 2022 - Engaging with Developments in the Political, Economic and Social Spheres.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "0fef24315f97f6745ff40a2923029ec737c707854494670fda8741e22f88d61d",
    fileName:
      "The Indonesian Military Enjoys Strong Public Trust and Support - Reasons and Implications.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
  {
    fingerprint: "070eb96f4a875430279cf81e0654ba461a54a984a9e8f71d683af98710846012",
    fileName:
      "Vote Buying in Indonesia - The Mechanics of Electoral Bribery.jpg",
    rightsNote: ownerApprovedRightsNote,
  },
] as const;
