import { request } from '../core/helpers/Request';
import { dispatch } from '../core/helpers/EventEmitter';

export function fetchList(params) {
  request(`/quiz/byLection/${params.lectionId}`, params, 'get',
    (r) => dispatch('quiz:fetch:success', r),
    (e) => dispatch('quiz:fetch:fail', e)
  );
};

export function addQuiz(params) {
  request('/quiz', params, 'post',
    (r) => dispatch('quiz:add:success', r),
    (e) => dispatch('quiz:add:fail', e)
  );
};

export function updateQuiz(params) {
  request(`/quiz/${params.id}`, params, 'put',
    (r) => dispatch('quiz:update:success', r),
    (e) => dispatch('quiz:update:fail', e)
  );
};

export function fetchQuestionList(params) {
  request(`/quizQuestions?quizId=${params.quizId}`, {}, 'get',
      (r) => dispatch('quiz:question:fetch:success', r),
      (e) => dispatch('quiz:question:fetch:fail', e)
  );
};

export function addQuestion(params) {
  request(`/quizQuestion`, params, 'post',
      (r) => dispatch('quiz:question:add:success', r),
      (e) => dispatch('quiz:question:add:fail', e)
  );
};

export function updateQuestion(params) {
  request(`/quizQuestion`, params, 'put',
      (r) => dispatch('quiz:question:update:success', r),
      (e) => dispatch('quiz:question:update:fail', e)
  );
};