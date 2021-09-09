import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {TemplateButton, TemplateButtonRelations, Button} from '../models';
import {ButtonRepository} from './button.repository';

export class TemplateButtonRepository extends DefaultCrudRepository<
  TemplateButton,
  typeof TemplateButton.prototype.id,
  TemplateButtonRelations
> {

  public readonly buttons: HasManyRepositoryFactory<Button, typeof TemplateButton.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ButtonRepository') protected buttonRepositoryGetter: Getter<ButtonRepository>,
  ) {
    super(TemplateButton, dataSource);
    this.buttons = this.createHasManyRepositoryFactoryFor('buttons', buttonRepositoryGetter,);
    this.registerInclusionResolver('buttons', this.buttons.inclusionResolver);
  }
}
