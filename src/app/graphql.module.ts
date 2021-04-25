import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { HttpHeaders } from '@angular/common/http';
import { CURRENT_USER } from './constants/constants';
import { setContext } from '@apollo/client/link/context';
import { LoginData } from './graphql/models';

const uri = 'https://sinem-eval.herokuapp.com/sinem-eval'; // <-- add the URL of the GraphQL server here

const basic = setContext((operation, context) => ({
  headers: {
    Accept: 'charset=utf-8'
  }
}));

const middleware = setContext((operation, forward) => {
  const user_data = JSON.parse(localStorage.getItem(CURRENT_USER)) as LoginData;
  if (user_data) {
    return forward({
      headers: new HttpHeaders().set('Authorization', `Bearer ${user_data.token}`)
    });
  } else {
    return {};
  }
});

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: ApolloLink.from([basic, middleware, httpLink.create({uri})]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}

