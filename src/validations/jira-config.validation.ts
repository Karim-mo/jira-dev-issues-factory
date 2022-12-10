import { IssueType } from '@enums/issue-type.enum';
import Joi from 'joi';

const estimatesRegex = new RegExp(
  /^(?=\d+[ywdhms])(( ?\d+y)?(?!\d))?(( ?\d+w)?(?!\d))?(( ?\d+d)?(?!\d))?(( ?\d+h)?(?!\d))?(( ?\d+m)?(?!\d))?(( ?\d+s)?(?!\d))?( ?\d+ms)?$/,
);

const jiraEpicConfigValidation = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IssueType))
    .required(),
}).when('.type', {
  is: IssueType.EPIC,
  then: Joi.object({
    issues: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        estimate: Joi.string().pattern(estimatesRegex).required(),
        subTasks: Joi.array()
          .items(
            Joi.object({
              title: Joi.string().required(),
              estimate: Joi.string().pattern(estimatesRegex).required(),
            }),
          )
          .optional(),
      }),
    ),
  }),
});

// When type is story, the subtasks array is not allowed
const jiraStoryConfigValidation = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IssueType))
    .required(),
}).when('.type', {
  is: IssueType.STORY,
  then: Joi.object({
    issues: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        estimate: Joi.string().pattern(estimatesRegex).required(),
      }),
    ),
  }),
});

// When type is dev task, the subtasks array is not allowed
const jiraDevTaskNoParentConfigValidation = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IssueType))
    .required(),
}).when('.type', {
  is: IssueType.DEV_TASK,
  then: Joi.object({
    issues: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        estimate: Joi.string().pattern(estimatesRegex).required(),
      }),
    ),
  }),
});

// When type is dev task, the subtasks array is not allowed
const jiraDevTaskParentConfigValidation = Joi.object({
  type: Joi.string()
    .valid(...Object.values(IssueType))
    .required(),
}).when('.type', {
  is: IssueType.DEV_TASK,
  then: Joi.object({
    issues: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        description: Joi.string().optional(),
        estimate: Joi.string().pattern(estimatesRegex).required(),
        subTasks: Joi.array()
          .items(
            Joi.object({
              title: Joi.string().required(),
              estimate: Joi.string().pattern(estimatesRegex).required(),
            }),
          )
          .optional(),
      }),
    ),
  }),
});

export const jiraConfigValidation = Joi.alternatives(
  jiraEpicConfigValidation,
  jiraStoryConfigValidation,
  jiraDevTaskNoParentConfigValidation,
  jiraDevTaskParentConfigValidation,
);
