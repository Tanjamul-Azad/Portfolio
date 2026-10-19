# Article revision: October 20, 2026

The five blog URLs are unchanged. Content is stored in `src/content/blog.json`; original publication dates are retained and `updatedAt` records this revision. Reading time is computed at 200 prose words per minute, excluding fenced code.

| Topic | Words including examples | Reading time | Main teaching contribution |
| --- | ---: | --- | --- |
| Neuro-symbolic AI | 1,550 | 8 minutes | Executable validator, specification gap, solver boundary and evaluation design |
| Reversal curse | 1,587 | 8 minutes | Paired probes, relation cardinality, contextual versus parameter learning and bidirectional retrieval |
| Complete Legal Aid | 1,729 | 9 minutes | Authorization, state transitions, reconnect recovery, outbox trade-offs and bounded AI drafting |
| ChefMate | 1,618 | 8 minutes | Current count-vector baseline, normalization contracts, filtered-index mismatch and a corrected candidate search |
| Care Companion | 1,701 | 9 minutes | Reading freshness, placeholder conversions, bounded frame buffering and failure-injection exercises |

All five Python teaching examples were executed successfully. They are original simplified examples, not claims that the proposed changes have already been shipped in the separate project repositories. Suggested evaluations are explicitly identified as proposals, not measured results.

## Implementation evidence inspected

- ChefMate commit `74544443dfe3ef54d8c88dd1fd2b27e135b3cf7e`: `utils.py`, `train_model.py`, `predict.py`. Training uses CountVectorizer and cosine NearestNeighbors. The prediction code computes a filtered matrix but queries the original fitted model and interprets returned positions against filtered rows. The article explains the mismatch without claiming to have fixed that repository.
- Care Companion commit `fa34146200a188af381e7eb5848546033b33d7fa`: README and `raspi/sensor_reader.py`. The Pi reader contains a placeholder ADC-to-BPM conversion. Distinct prototype hardware paths are kept distinct in the article.
- Complete Legal Aid commit `ce0875f8e178d1aa8d0d876055dc1be43c0ce245`: realtime access checks and agent guardrails inspected through authorized repository access. No private source files or credentials are copied into this portfolio. The article discusses general patterns with original examples.

Unsubstantiated blog claims of 70% ingredient-recognition improvement, 60 FPS rover performance and a generally validated 45-to-3-minute drafting improvement were removed. Framework and research references are linked beside relevant explanations and collected at each article's end. Historical model results are labeled as results from the cited studies, not current-model guarantees or the author's own experiments.

## Reading experience

Homepage and blog index share `BlogCollection`: below 1024px a snap carousel, a position counter and progress line match the Projects interaction. Keyboard left/right navigation and reduced-motion preferences are supported. Desktop retains three/four compact columns. Article pages add a collapsible section index with heading anchors, one page title and an updated date.
