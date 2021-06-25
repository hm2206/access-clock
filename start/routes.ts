import Route from '@ioc:Adonis/Core/Route';

Route.get('api/assistances', 'AssistancesController.index')
Route.post('api/assistances/:ip/syncronize', 'AssistancesController.syncronize')