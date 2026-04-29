import type { Publication, Theme } from "@/_internal/types";

const theme: Theme = {
  accentColor:     "#0a4b7c",   // headings, title color  (any CSS color)
  pageBackground:  "#ffffff",   // page background
  blockBackground: "#f7f7f7",   // abstract / text-block background
  baseFontSize:    16,          // root font size in px (scales everything)
  titleFontSize:   48,          // paper title, max px (clamped on small screens)
  authorFontSize:  18,          // author list font size in px
  headingFontSize: 22,          // h2/h3 inside abstract & content
  abstractFontSize:16,          // abstract body text in px
  contentFontSize: 16,          // markdown body text in px
  mediaTitleFontSize:  18,      // media item title font size in px
  mediaCaptionFontSize:18,      // media item caption font size in px
  contentMaxWidth: 1200,        // max column width in px
  bodyFont:        "Lato, sans-serif",
  headingFont:     '"Patua One", serif',
};

const publication: Publication = {
  title: "Kinetic Mining in Context: Few-Shot Action Synthesis via Text-to-Motion Distillation",
  theme,

  authors: [
    ["L. Cazzola", "https://scholar.google.com/citations?user=fsnsqoYAAAAJ&hl=en"],
    ["A. Alboody",  "https://scholar.google.com/citations?user=DOoU5dEAAAAJ&hl=en"],
  ],

  affiliations: "University of Trento; CESI LINEACT",
  venue: "ICPR • 28th International Conference on Pattern Recognition",
  year:  "2026",

  paper:         "https://arxiv.org/abs/2512.11654",
  pdf:           undefined,
  code:          "https://github.com/LuCazzola/md-paper",
  supplementary: undefined,

  siteUrl: "https://lucazzola.github.io/",

  teaserIndex: 1,

  abstract: "The acquisition cost for large, annotated motion datasets remains a critical bottleneck for skeletal-based Human Activity Recognition (HAR). Although Text-to-Motion (T2M) generative models offer a compelling, scalable source of synthetic data, their training objectives, which emphasize general artistic motion, and dataset structures fundamentally differ from HAR's requirements for kinematically precise, class-discriminative actions. This disparity creates a significant domain gap, making generalist T2M models ill-equipped for generating motions suitable for HAR classifiers. To address this challenge, we propose KineMIC (Kinetic Mining In Context), a transfer learning framework for few-shot action synthesis. KineMIC adapts a T2M diffusion model to an HAR domain by hypothesizing that semantic correspondences in the text encoding space can provide soft supervision for kinematic distillation. We operationalize this via a kinetic mining strategy that leverages CLIP text embeddings to establish correspondences between sparse HAR labels and T2M source data. This process guides fine-tuning, transforming the generalist T2M backbone into a specialized few-shot Action-to-Motion generator. We validate KineMIC using HumanML3D as the source T2M dataset and a subset of NTU RGB+D 120 as the target HAR domain, randomly selecting just 10 samples per action class for training. Our approach generates significantly more coherent motions, providing a robust data augmentation source that delivers a +23.1% accuracy points improvement.",

  media: [
    // 1 — teaser overview image
    {
      type:    "image",
      src:     "/media/kinemic/panel_full.png",
      id:      "teaser",
      title:   "KineMIC Overview",
      caption: "High-level overview of the KineMIC framework.",
    },

    // 2–7: window extraction examples
    { type: "video", src: "/media/kinemic/renders/window_extraction/sidekick_extraction_1.mp4", title: "(S) 'a man kicks with his left leg- first up, then to the left, then backwards.' — (T) 'side kick.'",          caption: "In this example, the man performs multiple variations of kicks in the same source motion. The extracted window corresponds to 'left kicking' which is reasonably much more correlated to 'side kick' than other options." },
    { type: "video", src: "/media/kinemic/renders/window_extraction/stretch_extraction_1.mp4",  title: "(S) 'a person gracefully performs a contemporary dance.' — (T) 'stretch on self.'",                            caption: "In this example, the person performs multiple dance moves in the same source motion. While caption description is arguably far from 'stretch on self', if isolated, some movements can be interpreted as a stretch type of movement." },
    { type: "video", src: "/media/kinemic/renders/window_extraction/runspot_extraction_1.mp4",  title: "(S) 'a person marches in place, stands, and then runs in place.' — (T) 'run on the spot.'",                   caption: "The extracted window captures the 'running in place' segment, which aligns closely with the target description 'run on the spot'." },
    { type: "video", src: "/media/kinemic/renders/window_extraction/sidekick_extraction_2.mp4", title: "(S) 'the sim is dancing kicking both legs around.' — (T) 'side kick.'",                                        caption: "The character movement is rather chaotic. The extracted window captures the instance where leg movement aligns most closely with 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/window_extraction/stretch_extraction_2.mp4",  title: "(S) 'a person lowers himself into a yoga position.' — (T) 'stretch on self.'",                                 caption: "The section best aligned with 'stretch on self' refers to the segment where the full-pike position is held, emphasizing the stretch aspect." },
    { type: "video", src: "/media/kinemic/renders/window_extraction/runspot_extraction_2.mp4",  title: "(S) 'a person is running on a treadmill.' — (T) 'run on the spot.'",                                           caption: "Some lucky samples might be almost one-to-one correspondences. In this case, the entire source motion is correlated to the target action 'run on the spot'." },

    // 8–16: ground truth examples (3 × 3 actions)
    { type: "video", src: "/media/kinemic/renders/ground_truth/S031C003P097R001A102.mp4", title: "'side kick' (1)",       caption: "A ground truth example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S028C003P043R001A104.mp4", title: "'stretch on self' (1)", caption: "A ground truth example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S019C002P042R002A099.mp4", title: "'run on the spot' (1)", caption: "A ground truth example of 'run on the spot'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S027C001P006R001A102.mp4", title: "'side kick' (2)",       caption: "A ground truth example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S028C003P087R001A104.mp4", title: "'stretch on self' (2)", caption: "A ground truth example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S025C003P058R001A099.mp4", title: "'run on the spot' (2)", caption: "A ground truth example of 'run on the spot'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S028C001P008R002A102.mp4", title: "'side kick' (3)",       caption: "A ground truth example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S031C003P043R001A104.mp4", title: "'stretch on self' (3)", caption: "A ground truth example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/ground_truth/S031C003P043R001A099.mp4", title: "'run on the spot' (3)", caption: "A ground truth example of 'run on the spot'." },

    // 17–31: generated examples (5 × 3 actions)
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_sidekick_render_1.mp4", title: "'side kick' (1)",       caption: "A generated example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_stretch_render_1.mp4",  title: "'stretch on self' (1)", caption: "A generated example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_runspot_render_1.mp4",  title: "'run on the spot' (1)", caption: "A generated example of 'run on the spot'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_sidekick_render_2.mp4", title: "'side kick' (2)",       caption: "A generated example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_stretch_render_2.mp4",  title: "'stretch on self' (2)", caption: "A generated example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_runspot_render_2.mp4",  title: "'run on the spot' (2)", caption: "A generated example of 'run on the spot'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_sidekick_render_3.mp4", title: "'side kick' (3)",       caption: "A generated example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_stretch_render_3.mp4",  title: "'stretch on self' (3)", caption: "A generated example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_runspot_render_3.mp4",  title: "'run on the spot' (3)", caption: "A generated example of 'run on the spot'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_sidekick_render_4.mp4", title: "'side kick' (4)",       caption: "A generated example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_stretch_render_4.mp4",  title: "'stretch on self' (4)", caption: "A generated example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_runspot_render_4.mp4",  title: "'run on the spot' (4)", caption: "A generated example of 'run on the spot'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_sidekick_render_5.mp4", title: "'side kick' (5)",       caption: "A generated example of 'side kick'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_stretch_render_5.mp4",  title: "'stretch on self' (5)", caption: "A generated example of 'stretch on self'." },
    { type: "video", src: "/media/kinemic/renders/generated/kinemic_runspot_render_5.mp4",  title: "'run on the spot' (5)", caption: "A generated example of 'run on the spot'." },

    // 32–34: motion composition examples
    { type: "video", src: "/media/kinemic/renders/composition/composition_1.mp4", title: "'a person is jumping' + 'stretch on self'",    caption: "The sim starts in a crouched position, then raises both arms overhead while jumping simultaneously." },
    { type: "video", src: "/media/kinemic/renders/composition/composition_2.mp4", title: "'a person throws punches' + 'stretch on self'", caption: "The man begins to perform a punch/throw motion, which transitions into torso twists for the stretching component." },
    { type: "video", src: "/media/kinemic/renders/composition/composition_3.mp4", title: "'a person is jumping' + 'stretch on self'",    caption: "The avatar explosively raises both arms overhead and proceeds performing a big jump." },

    // 35–40: pre-trained MDM comparison
    { type: "video", src: "/media/kinemic/renders/comparison/mdm_pretrained_gen_1.mp4", title: "Pre-trained MDM (1)", caption: "Pre-trained MDM (1)" },
    { type: "video", src: "/media/kinemic/renders/comparison/mdm_pretrained_gen_2.mp4", title: "Pre-trained MDM (2)", caption: "Pre-trained MDM (2)" },
    { type: "video", src: "/media/kinemic/renders/comparison/mdm_pretrained_gen_3.mp4", title: "Pre-trained MDM (3)", caption: "Pre-trained MDM (3)" },
    { type: "video", src: "/media/kinemic/renders/comparison/mdm_pretrained_gen_4.mp4", title: "Pre-trained MDM (4)", caption: "Pre-trained MDM (4)" },
    { type: "video", src: "/media/kinemic/renders/comparison/mdm_pretrained_gen_5.mp4", title: "Pre-trained MDM (5)", caption: "Pre-trained MDM (5)" },
    { type: "video", src: "/media/kinemic/renders/comparison/mdm_pretrained_gen_6.mp4", title: "Pre-trained MDM (6)", caption: "Pre-trained MDM (6)" },

    // 41–46: KineMIC comparison
    { type: "video", src: "/media/kinemic/renders/comparison/kinemic_gen_1.mp4", title: "KineMIC (1)", caption: "KineMIC (1)" },
    { type: "video", src: "/media/kinemic/renders/comparison/kinemic_gen_2.mp4", title: "KineMIC (2)", caption: "KineMIC (2)" },
    { type: "video", src: "/media/kinemic/renders/comparison/kinemic_gen_3.mp4", title: "KineMIC (3)", caption: "KineMIC (3)" },
    { type: "video", src: "/media/kinemic/renders/comparison/kinemic_gen_4.mp4", title: "KineMIC (4)", caption: "KineMIC (4)" },
    { type: "video", src: "/media/kinemic/renders/comparison/kinemic_gen_5.mp4", title: "KineMIC (5)", caption: "KineMIC (5)" },
    { type: "video", src: "/media/kinemic/renders/comparison/kinemic_gen_6.mp4", title: "KineMIC (6)", caption: "KineMIC (6)" },
  ],
};

export default publication;
